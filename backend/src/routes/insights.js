const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

const insightsCache = { data: null, timestamp: 0 };

// GET /api/insights - Failure trend analytics
router.get('/', async (req, res, next) => {
  try {
    // Check cache (24h)
    if (insightsCache.data && (Date.now() - insightsCache.timestamp) < 86400000) {
      return res.json(insightsCache.data);
    }

    const [failureData, yearlyData, topViewed, industryData, totalCount, fundingAggregate, fastestStartup, averageRisk] = await Promise.all([
      // Top failure reasons by industry
      prisma.failureReason.groupBy({
        by: ['category'],
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
        take: 10,
      }),
      // Yearly failure count
      prisma.startup.groupBy({
        by: ['shutdownYear'],
        _count: { id: true },
        where: { shutdownYear: { not: null } },
        orderBy: { shutdownYear: 'asc' },
      }),
      // Top viewed (use lifetime months as proxy)
      prisma.startup.findMany({
        orderBy: { lifetimeMonths: 'desc' },
        take: 5,
        select: { name: true, slug: true, industry: true, lifetimeMonths: true },
      }),
      // Industry breakdown
      prisma.startup.groupBy({
        by: ['industry'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      // Total failed startups count
      prisma.startup.count(),
      // Total funding lost
      prisma.startup.aggregate({
        _sum: {
          fundingInr: true,
        },
      }),
      // Fastest startup collapse
      prisma.startup.findFirst({
        where: {
          lifetimeMonths: { not: null, gt: 0 },
        },
        orderBy: {
          lifetimeMonths: 'asc',
        },
        select: {
          name: true,
          lifetimeMonths: true,
        },
      }),
      // Industry risk score calculation
      prisma.aiAnalysis.aggregate({
        _avg: {
          pmfScore: true,
          retentionScore: true,
          monetizationScore: true,
        },
      }),
    ]);

    const totalFunding = fundingAggregate._sum.fundingInr ? fundingAggregate._sum.fundingInr.toString() : '0';
    const mostCommonReason = failureData[0]?.category || 'pmf';
    const fastestCollapseName = fastestStartup ? `${fastestStartup.name} (${fastestStartup.lifetimeMonths} Months)` : 'N/A';
    const avgRisk = averageRisk._avg.pmfScore 
      ? Math.round((averageRisk._avg.pmfScore + averageRisk._avg.retentionScore + averageRisk._avg.monetizationScore) / 3) 
      : 74;

    const result = {
      metrics: {
        totalFailed: totalCount,
        totalFundingLost: totalFunding,
        mostCommonReason: mostCommonReason,
        fastestCollapse: fastestCollapseName,
        industryRiskScore: avgRisk,
      },
      topFailureReasonsByIndustry: failureData.map(f => ({
        category: f.category,
        count: f._count.category,
      })),
      yearlyTrends: yearlyData.map(y => ({
        year: y.shutdownYear,
        count: y._count.id,
      })),
      topViewed: topViewed.map(t => ({
        name: t.name,
        slug: t.slug,
        industry: t.industry,
        lifetimeMonths: t.lifetimeMonths,
      })),
      industryBreakdown: industryData.map(i => ({
        industry: i.industry,
        count: i._count.id,
      })),
    };

    insightsCache.data = result;
    insightsCache.timestamp = Date.now();

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;