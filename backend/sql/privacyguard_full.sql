-- Privacy Guard complete PostgreSQL schema and seed data.
-- Database: privacyguard
-- Usage:
--   createdb -U postgres privacyguard
--   psql -U postgres -d privacyguard -f backend/sql/privacyguard_full.sql

BEGIN;

CREATE TABLE IF NOT EXISTS user_account (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    openid VARCHAR(64) UNIQUE,
    unionid VARCHAR(64),
    phone VARCHAR(20),
    nickname VARCHAR(64),
    avatar_url VARCHAR(512),
    gender SMALLINT DEFAULT 0,
    status SMALLINT NOT NULL DEFAULT 1,
    source VARCHAR(20) DEFAULT 'wechat',
    last_login_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visitor_session (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_token VARCHAR(128) NOT NULL UNIQUE,
    source VARCHAR(20) DEFAULT 'miniapp',
    expire_at TIMESTAMP NOT NULL,
    converted_user_id BIGINT
);

CREATE TABLE IF NOT EXISTS family_binding (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    initiator_id BIGINT NOT NULL,
    acceptor_id BIGINT,
    invite_code VARCHAR(32) UNIQUE,
    bind_code VARCHAR(32),
    relation_type VARCHAR(20) DEFAULT 'family',
    status SMALLINT NOT NULL DEFAULT 0,
    share_policy VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS family_member (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    target_user_id BIGINT NOT NULL,
    relation VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS risk_check_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    total_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20),
    summary TEXT
);

CREATE TABLE IF NOT EXISTS risk_dimension_score (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_record_id BIGINT NOT NULL,
    dimension_type VARCHAR(50) NOT NULL,
    score INTEGER DEFAULT 0,
    risk_level VARCHAR(20),
    detail TEXT
);

CREATE TABLE IF NOT EXISTS risk_issue_item (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_record_id BIGINT NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    title VARCHAR(200),
    description TEXT,
    suggestion TEXT,
    priority INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS policy_interpret_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    input_type VARCHAR(20) NOT NULL,
    input_content TEXT,
    collect_scope TEXT,
    usage_purpose TEXT,
    share_risk TEXT,
    risk_conclusion TEXT,
    suggestion TEXT,
    status SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS interpret_task (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    task_type VARCHAR(32) NOT NULL,
    content TEXT,
    status VARCHAR(32) NOT NULL,
    risk_level VARCHAR(32),
    result_summary TEXT,
    advice TEXT
);

CREATE TABLE IF NOT EXISTS interpret_template (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    template_name VARCHAR(100) NOT NULL,
    template_code VARCHAR(64) UNIQUE,
    category VARCHAR(50),
    content TEXT NOT NULL,
    variables TEXT,
    applicable_scene VARCHAR(200),
    status SMALLINT NOT NULL DEFAULT 1,
    version INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS image_analysis_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    sensitive_tags VARCHAR(500),
    risk_level VARCHAR(20),
    explanation TEXT,
    suggestion TEXT,
    status SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS link_scan_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    scan_type VARCHAR(20) NOT NULL,
    input_content TEXT,
    result_summary TEXT,
    risk_level VARCHAR(20),
    risk_reason TEXT,
    suggestion TEXT,
    status SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS scan_history (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    total_score INTEGER DEFAULT 0,
    risk_level VARCHAR(32),
    status VARCHAR(32) NOT NULL,
    issue_payload TEXT
);

CREATE TABLE IF NOT EXISTS account_asset_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    platform_name VARCHAR(100) NOT NULL,
    account_identifier VARCHAR(200),
    risk_tips TEXT,
    has_weak_password BOOLEAN DEFAULT FALSE,
    has_duplicate_password BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS asset_account (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    platform_name VARCHAR(32),
    account_name VARCHAR(64),
    pwd_hash VARCHAR(128),
    risk_level VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS share_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sharer_id BIGINT NOT NULL,
    target_id BIGINT NOT NULL,
    share_type VARCHAR(20) NOT NULL,
    ref_type VARCHAR(50),
    ref_id BIGINT,
    status SMALLINT NOT NULL DEFAULT 1,
    revoke_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS message_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    msg_type VARCHAR(30) NOT NULL,
    title VARCHAR(200),
    content TEXT,
    jump_type VARCHAR(50),
    jump_target VARCHAR(200),
    status SMALLINT NOT NULL DEFAULT 0,
    send_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS message_template (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(30),
    content TEXT NOT NULL,
    variables TEXT,
    status SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS message_notification (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    title VARCHAR(128),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS system_announcement (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    scope VARCHAR(30),
    status VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_feedback (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    feedback_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    attachment_url VARCHAR(512),
    ref_type VARCHAR(50),
    ref_id BIGINT,
    status SMALLINT NOT NULL DEFAULT 0,
    handler_id BIGINT,
    handler_note TEXT,
    reply_content TEXT
);

CREATE TABLE IF NOT EXISTS feedback_ticket (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reporter_id VARCHAR(32),
    issue_type VARCHAR(64),
    content TEXT,
    status VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS risk_rule (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rule_name VARCHAR(100) NOT NULL,
    rule_code VARCHAR(64) UNIQUE,
    rule_type VARCHAR(50) NOT NULL,
    dimension_type VARCHAR(50),
    condition_expr TEXT,
    description TEXT,
    risk_level VARCHAR(20) DEFAULT 'medium',
    status SMALLINT NOT NULL DEFAULT 1,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS risk_rule_weight (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rule_id BIGINT,
    dimension_type VARCHAR(50) NOT NULL,
    weight DECIMAL(5,2) DEFAULT 1.00,
    threshold_high INTEGER DEFAULT 80,
    threshold_medium INTEGER DEFAULT 50,
    threshold_low INTEGER DEFAULT 20
);

CREATE TABLE IF NOT EXISTS security_rule (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_module VARCHAR(64),
    evaluation_condition VARCHAR(255),
    exec_action VARCHAR(64),
    status VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS knowledge_article (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    scene_tags VARCHAR(500),
    suggestion_text TEXT,
    category VARCHAR(50),
    status SMALLINT NOT NULL DEFAULT 1,
    hit_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS async_task_record (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    task_type VARCHAR(30) NOT NULL,
    ref_type VARCHAR(50),
    ref_id BIGINT,
    status SMALLINT NOT NULL DEFAULT 0,
    duration_ms INTEGER,
    fail_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retry INTEGER DEFAULT 3
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    log_type VARCHAR(30) NOT NULL,
    operator_id BIGINT,
    operator_type VARCHAR(20) DEFAULT 'user',
    operator_name VARCHAR(64),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id BIGINT,
    detail TEXT,
    result VARCHAR(20) DEFAULT 'success',
    ip_address VARCHAR(50),
    user_agent VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS admin_role (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_name VARCHAR(64) NOT NULL,
    role_code VARCHAR(64) NOT NULL UNIQUE,
    permissions TEXT,
    menu_permissions TEXT,
    description VARCHAR(200),
    status SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS admin_account (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_name VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(128) NOT NULL,
    real_name VARCHAR(64),
    phone VARCHAR(20),
    email VARCHAR(100),
    role_id BIGINT,
    status SMALLINT NOT NULL DEFAULT 1,
    last_login_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dict_config (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL DEFAULT 'default',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dict_type VARCHAR(50) NOT NULL,
    dict_key VARCHAR(100) NOT NULL,
    dict_value VARCHAR(500),
    dict_label VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    status SMALLINT NOT NULL DEFAULT 1,
    remark VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS tenant_org_extension (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    org_id VARCHAR(64),
    org_name VARCHAR(200),
    contact_name VARCHAR(64),
    contact_phone VARCHAR(20),
    status SMALLINT NOT NULL DEFAULT 1
);

ALTER TABLE family_binding
    ADD CONSTRAINT fk_family_binding_initiator
    FOREIGN KEY (initiator_id) REFERENCES user_account(id) ON DELETE CASCADE;
ALTER TABLE family_binding
    ADD CONSTRAINT fk_family_binding_acceptor
    FOREIGN KEY (acceptor_id) REFERENCES user_account(id) ON DELETE SET NULL;
ALTER TABLE family_member
    ADD CONSTRAINT fk_family_member_user
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE;
ALTER TABLE family_member
    ADD CONSTRAINT fk_family_member_target
    FOREIGN KEY (target_user_id) REFERENCES user_account(id) ON DELETE CASCADE;
ALTER TABLE risk_check_record
    ADD CONSTRAINT fk_risk_check_user
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE;
ALTER TABLE risk_dimension_score
    ADD CONSTRAINT fk_risk_dimension_check
    FOREIGN KEY (check_record_id) REFERENCES risk_check_record(id) ON DELETE CASCADE;
ALTER TABLE risk_issue_item
    ADD CONSTRAINT fk_risk_issue_check
    FOREIGN KEY (check_record_id) REFERENCES risk_check_record(id) ON DELETE CASCADE;
ALTER TABLE risk_rule_weight
    ADD CONSTRAINT fk_risk_rule_weight_rule
    FOREIGN KEY (rule_id) REFERENCES risk_rule(id) ON DELETE SET NULL;
ALTER TABLE admin_account
    ADD CONSTRAINT fk_admin_account_role
    FOREIGN KEY (role_id) REFERENCES admin_role(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_user_account_phone ON user_account(phone);
CREATE INDEX IF NOT EXISTS idx_user_account_tenant ON user_account(tenant_id);
CREATE INDEX IF NOT EXISTS idx_visitor_session_token ON visitor_session(session_token);
CREATE INDEX IF NOT EXISTS idx_family_binding_initiator ON family_binding(initiator_id);
CREATE INDEX IF NOT EXISTS idx_family_binding_acceptor ON family_binding(acceptor_id);
CREATE INDEX IF NOT EXISTS idx_family_member_user ON family_member(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_check_user ON risk_check_record(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_check_created ON risk_check_record(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_dimension_check ON risk_dimension_score(check_record_id);
CREATE INDEX IF NOT EXISTS idx_risk_issue_check ON risk_issue_item(check_record_id);
CREATE INDEX IF NOT EXISTS idx_risk_issue_priority ON risk_issue_item(priority DESC);
CREATE INDEX IF NOT EXISTS idx_policy_interpret_user ON policy_interpret_record(user_id);
CREATE INDEX IF NOT EXISTS idx_interpret_task_user ON interpret_task(user_id);
CREATE INDEX IF NOT EXISTS idx_interpret_template_category ON interpret_template(category);
CREATE INDEX IF NOT EXISTS idx_image_analysis_user ON image_analysis_record(user_id);
CREATE INDEX IF NOT EXISTS idx_link_scan_user ON link_scan_record(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_user ON scan_history(user_id);
CREATE INDEX IF NOT EXISTS idx_account_asset_user ON account_asset_record(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_account_user ON asset_account(user_id);
CREATE INDEX IF NOT EXISTS idx_share_record_sharer ON share_record(sharer_id);
CREATE INDEX IF NOT EXISTS idx_share_record_target ON share_record(target_id);
CREATE INDEX IF NOT EXISTS idx_message_record_user ON message_record(user_id);
CREATE INDEX IF NOT EXISTS idx_message_record_status ON message_record(user_id, status);
CREATE INDEX IF NOT EXISTS idx_message_notification_user ON message_notification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_ticket_status ON feedback_ticket(status);
CREATE INDEX IF NOT EXISTS idx_risk_rule_type ON risk_rule(rule_type);
CREATE INDEX IF NOT EXISTS idx_risk_rule_status ON risk_rule(status);
CREATE INDEX IF NOT EXISTS idx_security_rule_module ON security_rule(target_module);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_article(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_status ON knowledge_article(status);
CREATE INDEX IF NOT EXISTS idx_task_type ON async_task_record(task_type);
CREATE INDEX IF NOT EXISTS idx_task_status ON async_task_record(status);
CREATE INDEX IF NOT EXISTS idx_task_ref ON async_task_record(ref_type, ref_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_type ON audit_log(log_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_operator ON audit_log(operator_id, operator_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uk_dict_type_key ON dict_config(dict_type, dict_key, tenant_id);

INSERT INTO admin_role (role_name, role_code, permissions, description)
VALUES
    ('System Admin', 'ROLE_ADMIN', '["*"]', 'Full system permissions'),
    ('Operator', 'ROLE_OPERATOR', '["user:view","rule:*","template:*","knowledge:*","feedback:*","analytics:view","task:view"]', 'Operations management permissions')
ON CONFLICT (role_code) DO NOTHING;

INSERT INTO admin_account (login_name, password_hash, real_name, role_id)
SELECT 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'System Admin', id
FROM admin_role
WHERE role_code = 'ROLE_ADMIN'
ON CONFLICT (login_name) DO NOTHING;

INSERT INTO tenant_org_extension (tenant_id, org_name)
VALUES ('default', 'Default Organization')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO dict_config (dict_type, dict_key, dict_value, dict_label, sort_order)
VALUES
    ('risk_level', 'high', 'high', 'High Risk', 1),
    ('risk_level', 'medium', 'medium', 'Medium Risk', 2),
    ('risk_level', 'low', 'low', 'Low Risk', 3),
    ('risk_level', 'safe', 'safe', 'Safe', 4),
    ('dimension_type', 'permission', 'permission', 'Permission Risk', 1),
    ('dimension_type', 'account', 'account', 'Account Security Risk', 2),
    ('dimension_type', 'exposure', 'exposure', 'Privacy Exposure Risk', 3),
    ('dimension_type', 'fraud', 'fraud', 'Fraud And Link Risk', 4),
    ('dimension_type', 'policy', 'policy', 'Policy Authorization Risk', 5),
    ('task_status', '0', '0', 'Pending', 1),
    ('task_status', '1', '1', 'Submitted', 2),
    ('task_status', '2', '2', 'Analyzing', 3),
    ('task_status', '3', '3', 'Completed', 4),
    ('task_status', '4', '4', 'Failed', 5),
    ('feedback_type', 'problem', 'problem', 'Problem', 1),
    ('feedback_type', 'misreport', 'misreport', 'Misreport', 2),
    ('feedback_type', 'suggestion', 'suggestion', 'Suggestion', 3),
    ('feedback_type', 'appeal', 'appeal', 'Appeal', 4),
    ('share_type', 'reminder', 'reminder', 'Reminder Share', 1),
    ('share_type', 'record', 'record', 'Record Share', 2),
    ('msg_type', 'check', 'check', 'Check Message', 1),
    ('msg_type', 'reminder', 'reminder', 'Risk Reminder', 2),
    ('msg_type', 'share', 'share', 'Share Message', 3),
    ('msg_type', 'feedback', 'feedback', 'Feedback Message', 4),
    ('msg_type', 'system', 'system', 'System Message', 5)
ON CONFLICT (dict_type, dict_key, tenant_id) DO NOTHING;

COMMIT;
