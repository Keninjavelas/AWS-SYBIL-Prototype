-- S.Y.B.I.L. Node v4.0 - PostgreSQL Schema
-- Run this in your RDS instance query editor if needed.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCENARIOS
CREATE TABLE scenarios (
    scenario_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    context_brief TEXT NOT NULL,
    artifacts JSONB NOT NULL,     -- Logs, Slack msgs
    action_palette JSONB NOT NULL -- The valid choices
);

-- 2. RUBRICS
CREATE TABLE rubrics (
    rubric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id UUID REFERENCES scenarios(scenario_id),
    version VARCHAR(20) DEFAULT 'v1.0',
    criteria_map JSONB NOT NULL   -- { "risk": { "1": "...", "5": "..." } }
);

-- 3. SUBMISSIONS (The Tribunal Data)
CREATE TABLE submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id UUID REFERENCES scenarios(scenario_id),
    
    -- Inputs
    selected_actions JSONB,
    reasoning_text TEXT,
    
    -- Outputs (Hawk/Dove/Owl)
    hawk_result JSONB,
    dove_result JSONB,
    owl_result JSONB,
    
    final_score INTEGER,
    variance_score INTEGER,
    status VARCHAR(50), -- SCORED, FLAGGED_VARIANCE
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- SEED DATA: The "Friday Deploy" Scenario
INSERT INTO scenarios (title, context_brief, artifacts, action_palette) VALUES 
(
    'Incident: The Friday Deploy', 
    'It is Friday, 4:45 PM. VP demands deploy. Policy forbids it.',
    '[
        {"id": "slack", "label": "VP Msg", "content": "Deploy NOW."},
        {"id": "logs", "label": "Datadog", "content": "Error 500"}
    ]',
    '[
        {"id": "A", "label": "Force Deploy to Prod"},
        {"id": "B", "label": "Deploy to Sandbox"},
        {"id": "C", "label": "Do Nothing"}
    ]'
);

-- SEED DATA: The Rubric
INSERT INTO rubrics (scenario_id, criteria_map) 
VALUES (
    (SELECT scenario_id FROM scenarios LIMIT 1),
    '{
        "risk": {
            "1": "Deploys to Prod on Friday. High Risk.",
            "5": "Uses Sandbox or Feature Flag. Zero Risk."
        }
    }'
);