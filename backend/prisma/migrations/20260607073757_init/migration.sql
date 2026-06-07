-- CreateEnum
CREATE TYPE "StartupStatus" AS ENUM ('failed', 'acquired', 'pivoted', 'zombie');

-- CreateEnum
CREATE TYPE "FailureCategory" AS ENUM ('retention', 'monetization', 'pmf', 'cac', 'competition', 'team', 'timing', 'regulation', 'other');

-- CreateEnum
CREATE TYPE "TimelineStage" AS ENUM ('idea', 'prototype', 'launch', 'growth', 'decline', 'shutdown');

-- CreateEnum
CREATE TYPE "GraphOutcome" AS ENUM ('shutdown', 'acquired', 'pivoted');

-- CreateTable
CREATE TABLE "startups" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "status" "StartupStatus" NOT NULL,
    "industry" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "founding_year" INTEGER NOT NULL,
    "shutdown_year" INTEGER,
    "lifetime_months" INTEGER,
    "funding_inr" BIGINT,
    "peak_users" INTEGER,
    "team_size" INTEGER,
    "logo_url" TEXT,
    "summary" TEXT NOT NULL,
    "founder_story" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "startups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failure_reasons" (
    "id" UUID NOT NULL,
    "startup_id" UUID NOT NULL,
    "category" "FailureCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "severity_score" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "failure_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" UUID NOT NULL,
    "startup_id" UUID NOT NULL,
    "stage" "TimelineStage" NOT NULL,
    "event_date" DATE NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "metric_key" VARCHAR(100),
    "metric_value" DECIMAL(10,2),

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics_snapshots" (
    "id" UUID NOT NULL,
    "startup_id" UUID NOT NULL,
    "recorded_month" DATE NOT NULL,
    "users" INTEGER,
    "revenue_inr" BIGINT,
    "mrr_inr" BIGINT,
    "burn_rate_inr" BIGINT,
    "churn_rate" DECIMAL(5,2),

    CONSTRAINT "metrics_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" UUID NOT NULL,
    "startup_id" UUID NOT NULL,
    "retention_score" INTEGER NOT NULL,
    "monetization_score" INTEGER NOT NULL,
    "pmf_score" INTEGER NOT NULL,
    "marketing_score" INTEGER NOT NULL,
    "primary_cause" VARCHAR(100) NOT NULL,
    "confidence" INTEGER NOT NULL,
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "raw_llm_response" TEXT,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "confessions" (
    "id" UUID NOT NULL,
    "text" VARCHAR(280) NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "confessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graph_edges" (
    "id" UUID NOT NULL,
    "source_startup_id" UUID NOT NULL,
    "mistake_category" VARCHAR(100) NOT NULL,
    "target_startup_id" UUID,
    "outcome" "GraphOutcome" NOT NULL,
    "edge_weight" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "graph_edges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "startups_slug_key" ON "startups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ai_analyses_startup_id_key" ON "ai_analyses"("startup_id");

-- AddForeignKey
ALTER TABLE "failure_reasons" ADD CONSTRAINT "failure_reasons_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metrics_snapshots" ADD CONSTRAINT "metrics_snapshots_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_source_startup_id_fkey" FOREIGN KEY ("source_startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_target_startup_id_fkey" FOREIGN KEY ("target_startup_id") REFERENCES "startups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
