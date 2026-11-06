-- ============================================================
-- 个人隐私数据安全管家 — 数据库建表脚本
-- 数据库：privacyguard（PostgreSQL 18.1）
-- 版本：V1.0
-- 日期：2026-04-13
-- ============================================================

-- 说明：
-- 1. 所有表预留 tenant_id 字段，一期单租户默认 'default'
-- 2. 关键业务表包含 created_at / updated_at / status
-- 3. 主键统一使用 BIGSERIAL 自增
-- 4. 不存储用户密码明文
-- 5. 不长期存储上传原图

-- ============================================================
-- 1. 用户账号表
-- ============================================================
CREATE TABLE IF NOT EXISTS user_account (
    id              BIGSERIAL       PRIMARY KEY,
    openid          VARCHAR(64)     UNIQUE,                     -- 微信 openid
    unionid         VARCHAR(64),                                -- 微信 unionid
    phone           VARCHAR(20),                                -- 手机号（脱敏存储）
    nickname        VARCHAR(64),                                -- 昵称
    avatar_url      VARCHAR(512),                               -- 头像地址
    gender          SMALLINT        DEFAULT 0,                  -- 性别：0-未知 1-男 2-女
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 状态：0-禁用 1-正常
    source          VARCHAR(20)     DEFAULT 'wechat',           -- 来源：wechat/phone
    last_login_at   TIMESTAMP,                                  -- 最近登录时间
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL, -- 租户ID
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE user_account IS '用户账号表';
COMMENT ON COLUMN user_account.openid IS '微信 openid，唯一标识';
COMMENT ON COLUMN user_account.phone IS '手机号，脱敏存储';
COMMENT ON COLUMN user_account.status IS '状态：0-禁用 1-正常';

CREATE INDEX idx_user_account_phone ON user_account(phone);
CREATE INDEX idx_user_account_tenant ON user_account(tenant_id);

-- ============================================================
-- 2. 游客会话表
-- ============================================================
CREATE TABLE IF NOT EXISTS visitor_session (
    id                  BIGSERIAL       PRIMARY KEY,
    session_token       VARCHAR(128)    NOT NULL UNIQUE,         -- 会话标识
    source              VARCHAR(20)     DEFAULT 'miniapp',       -- 来源
    expire_at           TIMESTAMP       NOT NULL,                -- 失效时间
    converted_user_id   BIGINT,                                  -- 转正式用户后的用户ID
    tenant_id           VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE visitor_session IS '游客体验会话表';

-- ============================================================
-- 3. 家庭绑定关系表
-- ============================================================
CREATE TABLE IF NOT EXISTS family_binding (
    id              BIGSERIAL       PRIMARY KEY,
    initiator_id    BIGINT          NOT NULL,                   -- 发起方用户ID
    acceptor_id     BIGINT,                                     -- 接受方用户ID
    invite_code     VARCHAR(32)     UNIQUE,                     -- 邀请码
    bind_code       VARCHAR(32),                                -- 绑定码
    relation_type   VARCHAR(20)     DEFAULT 'family',           -- 关系类型
    status          SMALLINT        DEFAULT 0 NOT NULL,         -- 0-待确认 1-已绑定 2-已解除
    share_policy    VARCHAR(500),                               -- 共享策略 JSON
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_family_initiator FOREIGN KEY (initiator_id) REFERENCES user_account(id),
    CONSTRAINT fk_family_acceptor FOREIGN KEY (acceptor_id) REFERENCES user_account(id)
);

COMMENT ON TABLE family_binding IS '家庭成员绑定关系表';

CREATE INDEX idx_family_binding_initiator ON family_binding(initiator_id);
CREATE INDEX idx_family_binding_acceptor ON family_binding(acceptor_id);

-- ============================================================
-- 4. 一键体检记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_check_record (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,                   -- 用户ID
    total_score     INTEGER         DEFAULT 0,                  -- 总分
    risk_level      VARCHAR(20),                                -- 风险等级：high/medium/low/safe
    summary         TEXT,                                       -- 体检摘要
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_check_user FOREIGN KEY (user_id) REFERENCES user_account(id)
);

COMMENT ON TABLE risk_check_record IS '一键体检记录表';

CREATE INDEX idx_check_record_user ON risk_check_record(user_id);
CREATE INDEX idx_check_record_created ON risk_check_record(created_at DESC);

-- ============================================================
-- 5. 五维评分明细表
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_dimension_score (
    id                  BIGSERIAL       PRIMARY KEY,
    check_record_id     BIGINT          NOT NULL,               -- 关联体检记录ID
    dimension_type      VARCHAR(50)     NOT NULL,               -- 维度：permission/account/exposure/fraud/policy
    score               INTEGER         DEFAULT 0,              -- 维度得分
    risk_level          VARCHAR(20),                            -- 风险等级
    detail              TEXT,                                   -- 明细说明
    tenant_id           VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_dim_score_check FOREIGN KEY (check_record_id) REFERENCES risk_check_record(id)
);

COMMENT ON TABLE risk_dimension_score IS '五维评分明细表';
COMMENT ON COLUMN risk_dimension_score.dimension_type IS '维度类型：permission-权限风险/account-账号安全/exposure-隐私暴露/fraud-诈骗链接/policy-政策授权';

CREATE INDEX idx_dim_score_check ON risk_dimension_score(check_record_id);

-- ============================================================
-- 6. 风险问题明细表
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_issue_item (
    id                  BIGSERIAL       PRIMARY KEY,
    check_record_id     BIGINT          NOT NULL,               -- 关联体检记录ID
    issue_type          VARCHAR(50)     NOT NULL,               -- 问题类型
    risk_level          VARCHAR(20)     NOT NULL,               -- 风险等级
    title               VARCHAR(200),                           -- 问题标题
    description         TEXT,                                   -- 问题说明
    suggestion          TEXT,                                   -- 处理建议
    priority            INTEGER         DEFAULT 0,              -- 优先级（数值越大越优先）
    tenant_id           VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_issue_check FOREIGN KEY (check_record_id) REFERENCES risk_check_record(id)
);

COMMENT ON TABLE risk_issue_item IS '风险问题明细表';

CREATE INDEX idx_issue_item_check ON risk_issue_item(check_record_id);
CREATE INDEX idx_issue_item_priority ON risk_issue_item(priority DESC);

-- ============================================================
-- 7. 隐私政策解读记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS policy_interpret_record (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,                   -- 用户ID
    input_type      VARCHAR(20)     NOT NULL,                   -- 输入类型：name/link/text/screenshot
    input_content   TEXT,                                       -- 输入内容（名称、链接或文本摘要）
    collect_scope   TEXT,                                       -- 采集范围
    usage_purpose   TEXT,                                       -- 使用目的
    share_risk      TEXT,                                       -- 共享风险
    risk_conclusion TEXT,                                       -- 风险结论
    suggestion      TEXT,                                       -- 建议
    status          SMALLINT        DEFAULT 0 NOT NULL,         -- 0-待提交 1-已提交 2-分析中 3-已完成 4-失败
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_interpret_user FOREIGN KEY (user_id) REFERENCES user_account(id)
);

COMMENT ON TABLE policy_interpret_record IS '隐私政策解读记录表';

CREATE INDEX idx_interpret_user ON policy_interpret_record(user_id);

-- ============================================================
-- 8. 图片识别结果摘要表
-- ============================================================
CREATE TABLE IF NOT EXISTS image_analysis_record (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,                   -- 用户ID
    sensitive_tags  VARCHAR(500),                               -- 敏感信息标签（JSON数组）
    risk_level      VARCHAR(20),                                -- 风险等级
    explanation     TEXT,                                       -- 解释文本
    suggestion      TEXT,                                       -- 建议
    status          SMALLINT        DEFAULT 0 NOT NULL,         -- 任务状态
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_image_user FOREIGN KEY (user_id) REFERENCES user_account(id)
);

COMMENT ON TABLE image_analysis_record IS '图片识别结果摘要表（仅保留摘要，不保留原图）';

CREATE INDEX idx_image_analysis_user ON image_analysis_record(user_id);

-- ============================================================
-- 9. 链接/二维码扫描结果表
-- ============================================================
CREATE TABLE IF NOT EXISTS link_scan_record (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,                   -- 用户ID
    scan_type       VARCHAR(20)     NOT NULL,                   -- 扫描类型：link/qrcode
    input_content   TEXT,                                       -- 输入内容（链接或二维码内容摘要）
    result_summary  TEXT,                                       -- 扫描结果摘要
    risk_level      VARCHAR(20),                                -- 风险等级
    risk_reason     TEXT,                                       -- 风险原因
    suggestion      TEXT,                                       -- 建议
    status          SMALLINT        DEFAULT 0 NOT NULL,         -- 任务状态
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_scan_user FOREIGN KEY (user_id) REFERENCES user_account(id)
);

COMMENT ON TABLE link_scan_record IS '链接/二维码扫描结果表';

CREATE INDEX idx_link_scan_user ON link_scan_record(user_id);

-- ============================================================
-- 10. 账号资产摘要表
-- ============================================================
CREATE TABLE IF NOT EXISTS account_asset_record (
    id                      BIGSERIAL       PRIMARY KEY,
    user_id                 BIGINT          NOT NULL,           -- 用户ID
    platform_name           VARCHAR(100)    NOT NULL,           -- 平台名称
    account_identifier      VARCHAR(200),                       -- 账号标识摘要（脱敏）
    risk_tips               TEXT,                               -- 风险提示
    has_weak_password       BOOLEAN         DEFAULT FALSE,      -- 弱密码标记
    has_duplicate_password  BOOLEAN         DEFAULT FALSE,      -- 重复密码标记
    tenant_id               VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_asset_user FOREIGN KEY (user_id) REFERENCES user_account(id)
);

COMMENT ON TABLE account_asset_record IS '账号资产摘要表（不存储密码）';

CREATE INDEX idx_account_asset_user ON account_asset_record(user_id);

-- ============================================================
-- 11. 家庭共享记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS share_record (
    id              BIGSERIAL       PRIMARY KEY,
    sharer_id       BIGINT          NOT NULL,                   -- 共享人ID
    target_id       BIGINT          NOT NULL,                   -- 接收人ID
    share_type      VARCHAR(20)     NOT NULL,                   -- 共享类型：reminder/record
    ref_type        VARCHAR(50),                                -- 关联实体类型
    ref_id          BIGINT,                                     -- 关联实体ID
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 1-已共享 2-已撤回
    revoke_time     TIMESTAMP,                                  -- 撤回时间
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_share_sharer FOREIGN KEY (sharer_id) REFERENCES user_account(id),
    CONSTRAINT fk_share_target FOREIGN KEY (target_id) REFERENCES user_account(id)
);

COMMENT ON TABLE share_record IS '家庭共享记录表';

CREATE INDEX idx_share_sharer ON share_record(sharer_id);
CREATE INDEX idx_share_target ON share_record(target_id);

-- ============================================================
-- 12. 站内消息记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS message_record (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,                   -- 接收用户ID
    msg_type        VARCHAR(30)     NOT NULL,                   -- 消息类型：check/reminder/share/feedback/system
    title           VARCHAR(200),                               -- 消息标题
    content         TEXT,                                       -- 消息内容
    jump_type       VARCHAR(50),                                -- 跳转类型
    jump_target     VARCHAR(200),                               -- 跳转目标
    status          SMALLINT        DEFAULT 0 NOT NULL,         -- 0-未读 1-已读
    send_time       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,  -- 发送时间
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_message_user FOREIGN KEY (user_id) REFERENCES user_account(id)
);

COMMENT ON TABLE message_record IS '站内消息记录表';

CREATE INDEX idx_message_user ON message_record(user_id);
CREATE INDEX idx_message_status ON message_record(user_id, status);

-- ============================================================
-- 13. 用户反馈表
-- ============================================================
CREATE TABLE IF NOT EXISTS user_feedback (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,                   -- 用户ID
    feedback_type   VARCHAR(20)     NOT NULL,                   -- 类型：problem/misreport/suggestion/appeal
    content         TEXT            NOT NULL,                   -- 反馈内容
    attachment_url  VARCHAR(512),                               -- 附件地址（可选）
    ref_type        VARCHAR(50),                                -- 关联实体类型
    ref_id          BIGINT,                                     -- 关联实体ID
    status          SMALLINT        DEFAULT 0 NOT NULL,         -- 0-待处理 1-处理中 2-已回复 3-已关闭
    handler_id      BIGINT,                                     -- 处理人ID（后台管理员）
    handler_note    TEXT,                                       -- 处理备注
    reply_content   TEXT,                                       -- 回复内容
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES user_account(id)
);

COMMENT ON TABLE user_feedback IS '用户反馈表';

CREATE INDEX idx_feedback_user ON user_feedback(user_id);
CREATE INDEX idx_feedback_status ON user_feedback(status);

-- ============================================================
-- 14. 风险规则表
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_rule (
    id              BIGSERIAL       PRIMARY KEY,
    rule_name       VARCHAR(100)    NOT NULL,                   -- 规则名称
    rule_code       VARCHAR(64)     UNIQUE,                     -- 规则编码
    rule_type       VARCHAR(50)     NOT NULL,                   -- 规则类型：permission/image/link/policy/account
    dimension_type  VARCHAR(50),                                -- 对应风险维度
    condition_expr  TEXT,                                       -- 条件表达式/规则描述
    description     TEXT,                                       -- 规则说明
    risk_level      VARCHAR(20)     DEFAULT 'medium',           -- 默认风险等级
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 0-停用 1-启用
    sort_order      INTEGER         DEFAULT 0,                  -- 排序
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE risk_rule IS '风险规则表';

CREATE INDEX idx_risk_rule_type ON risk_rule(rule_type);
CREATE INDEX idx_risk_rule_status ON risk_rule(status);

-- ============================================================
-- 15. 规则权重和阈值表
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_rule_weight (
    id                  BIGSERIAL       PRIMARY KEY,
    rule_id             BIGINT,                                 -- 关联规则ID（可为空表示维度级配置）
    dimension_type      VARCHAR(50)     NOT NULL,               -- 维度类型
    weight              DECIMAL(5,2)    DEFAULT 1.00,           -- 权重
    threshold_high      INTEGER         DEFAULT 80,             -- 高风险阈值
    threshold_medium    INTEGER         DEFAULT 50,             -- 中风险阈值
    threshold_low       INTEGER         DEFAULT 20,             -- 低风险阈值
    tenant_id           VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_weight_rule FOREIGN KEY (rule_id) REFERENCES risk_rule(id)
);

COMMENT ON TABLE risk_rule_weight IS '规则权重和阈值配置表';

-- ============================================================
-- 16. 解读模板表
-- ============================================================
CREATE TABLE IF NOT EXISTS interpret_template (
    id              BIGSERIAL       PRIMARY KEY,
    template_name   VARCHAR(100)    NOT NULL,                   -- 模板名称
    template_code   VARCHAR(64)     UNIQUE,                     -- 模板编码
    category        VARCHAR(50),                                -- 模板分类
    content         TEXT            NOT NULL,                   -- 模板正文
    variables       TEXT,                                       -- 变量定义（JSON）
    applicable_scene VARCHAR(200),                              -- 适用场景
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 0-停用 1-启用
    version         INTEGER         DEFAULT 1,                  -- 版本号
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE interpret_template IS '解读模板表';

CREATE INDEX idx_template_category ON interpret_template(category);
CREATE INDEX idx_template_status ON interpret_template(status);

-- ============================================================
-- 17. 知识库内容表
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge_article (
    id              BIGSERIAL       PRIMARY KEY,
    title           VARCHAR(200)    NOT NULL,                   -- 标题
    content         TEXT            NOT NULL,                   -- 正文
    scene_tags      VARCHAR(500),                               -- 场景标签（JSON数组）
    suggestion_text TEXT,                                       -- 建议话术
    category        VARCHAR(50),                                -- 分类
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 0-下线 1-上线
    hit_count       INTEGER         DEFAULT 0,                  -- 命中次数
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE knowledge_article IS '知识库内容表';

CREATE INDEX idx_knowledge_category ON knowledge_article(category);
CREATE INDEX idx_knowledge_status ON knowledge_article(status);

-- ============================================================
-- 18. 异步任务记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS async_task_record (
    id              BIGSERIAL       PRIMARY KEY,
    task_type       VARCHAR(30)     NOT NULL,                   -- 任务类型：ocr/interpret/scan
    ref_type        VARCHAR(50),                                -- 关联实体类型
    ref_id          BIGINT,                                     -- 关联实体ID
    status          SMALLINT        DEFAULT 0 NOT NULL,         -- 0-待提交 1-已提交 2-分析中 3-已完成 4-失败
    duration_ms     INTEGER,                                    -- 耗时（毫秒）
    fail_reason     TEXT,                                       -- 失败原因
    retry_count     INTEGER         DEFAULT 0,                  -- 重试次数
    max_retry       INTEGER         DEFAULT 3,                  -- 最大重试次数
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE async_task_record IS '异步任务记录表';

CREATE INDEX idx_task_type ON async_task_record(task_type);
CREATE INDEX idx_task_status ON async_task_record(status);
CREATE INDEX idx_task_ref ON async_task_record(ref_type, ref_id);

-- ============================================================
-- 19. 审计日志表
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGSERIAL       PRIMARY KEY,
    log_type        VARCHAR(30)     NOT NULL,                   -- 日志类型：login/operation/config/file/message/share
    operator_id     BIGINT,                                     -- 操作人ID
    operator_type   VARCHAR(20)     DEFAULT 'user',             -- 操作人类型：user/admin
    operator_name   VARCHAR(64),                                -- 操作人名称
    action          VARCHAR(100)    NOT NULL,                   -- 动作
    target_type     VARCHAR(50),                                -- 目标实体类型
    target_id       BIGINT,                                     -- 目标实体ID
    detail          TEXT,                                       -- 详情
    result          VARCHAR(20)     DEFAULT 'success',          -- 结果：success/fail
    ip_address      VARCHAR(50),                                -- IP 地址
    user_agent      VARCHAR(500),                               -- 用户代理
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE audit_log IS '审计日志表';

CREATE INDEX idx_audit_log_type ON audit_log(log_type);
CREATE INDEX idx_audit_log_operator ON audit_log(operator_id, operator_type);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ============================================================
-- 20. 后台管理员账号表
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_account (
    id              BIGSERIAL       PRIMARY KEY,
    login_name      VARCHAR(64)     NOT NULL UNIQUE,            -- 登录名
    password_hash   VARCHAR(128)    NOT NULL,                   -- 密码哈希
    real_name       VARCHAR(64),                                -- 真实姓名
    phone           VARCHAR(20),                                -- 手机号
    email           VARCHAR(100),                               -- 邮箱
    role_id         BIGINT,                                     -- 角色ID
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 0-禁用 1-正常
    last_login_at   TIMESTAMP,                                  -- 最近登录时间
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE admin_account IS '后台管理员账号表';

-- ============================================================
-- 21. 后台角色表
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_role (
    id              BIGSERIAL       PRIMARY KEY,
    role_name       VARCHAR(64)     NOT NULL,                   -- 角色名称
    role_code       VARCHAR(64)     NOT NULL UNIQUE,            -- 角色编码
    permissions     TEXT,                                       -- 权限集（JSON）
    menu_permissions TEXT,                                      -- 菜单权限（JSON）
    description     VARCHAR(200),                               -- 角色描述
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 0-禁用 1-正常
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE admin_role IS '后台角色表';

-- 添加外键约束
ALTER TABLE admin_account ADD CONSTRAINT fk_admin_role FOREIGN KEY (role_id) REFERENCES admin_role(id);

-- ============================================================
-- 22. 基础字典配置表
-- ============================================================
CREATE TABLE IF NOT EXISTS dict_config (
    id              BIGSERIAL       PRIMARY KEY,
    dict_type       VARCHAR(50)     NOT NULL,                   -- 字典类型
    dict_key        VARCHAR(100)    NOT NULL,                   -- 字典键
    dict_value      VARCHAR(500),                               -- 字典值
    dict_label      VARCHAR(200),                               -- 显示标签
    sort_order      INTEGER         DEFAULT 0,                  -- 排序
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 0-禁用 1-正常
    remark          VARCHAR(200),                               -- 备注
    tenant_id       VARCHAR(64)     DEFAULT 'default' NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE dict_config IS '基础字典配置表';

CREATE INDEX idx_dict_type ON dict_config(dict_type);
CREATE UNIQUE INDEX uk_dict_type_key ON dict_config(dict_type, dict_key, tenant_id);

-- ============================================================
-- 23. 组织扩展表（多租户预留）
-- ============================================================
CREATE TABLE IF NOT EXISTS tenant_org_extension (
    id              BIGSERIAL       PRIMARY KEY,
    tenant_id       VARCHAR(64)     NOT NULL UNIQUE,            -- 租户ID
    org_id          VARCHAR(64),                                -- 组织ID
    org_name        VARCHAR(200),                               -- 组织名称
    contact_name    VARCHAR(64),                                -- 联系人
    contact_phone   VARCHAR(20),                                -- 联系电话
    status          SMALLINT        DEFAULT 1 NOT NULL,         -- 0-禁用 1-正常
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE tenant_org_extension IS '组织扩展表（多租户预留，一期单租户）';

-- ============================================================
-- 初始化数据
-- ============================================================

-- 插入默认角色
INSERT INTO admin_role (role_name, role_code, permissions, description) VALUES
    ('系统管理员', 'ROLE_ADMIN', '["*"]', '拥有全部系统权限'),
    ('运营管理员', 'ROLE_OPERATOR', '["user:view","rule:*","template:*","knowledge:*","feedback:*","analytics:view","task:view"]', '负责规则、模板、知识、反馈和数据管理');

-- 插入默认管理员账号（密码为 admin123 的 BCrypt 哈希）
INSERT INTO admin_account (login_name, password_hash, real_name, role_id) VALUES
    ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 1);

-- 插入默认租户
INSERT INTO tenant_org_extension (tenant_id, org_name) VALUES
    ('default', '默认组织');

-- 插入字典数据
INSERT INTO dict_config (dict_type, dict_key, dict_value, dict_label, sort_order) VALUES
    ('risk_level', 'high', 'high', '高风险', 1),
    ('risk_level', 'medium', 'medium', '中风险', 2),
    ('risk_level', 'low', 'low', '低风险', 3),
    ('risk_level', 'safe', 'safe', '安全', 4),
    ('dimension_type', 'permission', 'permission', '权限风险', 1),
    ('dimension_type', 'account', 'account', '账号安全风险', 2),
    ('dimension_type', 'exposure', 'exposure', '隐私暴露风险', 3),
    ('dimension_type', 'fraud', 'fraud', '诈骗与链接风险', 4),
    ('dimension_type', 'policy', 'policy', '数据授权与政策风险', 5),
    ('task_status', '0', '0', '待提交', 1),
    ('task_status', '1', '1', '已提交', 2),
    ('task_status', '2', '2', '分析中', 3),
    ('task_status', '3', '3', '已完成', 4),
    ('task_status', '4', '4', '失败', 5),
    ('feedback_type', 'problem', 'problem', '问题反馈', 1),
    ('feedback_type', 'misreport', 'misreport', '误报反馈', 2),
    ('feedback_type', 'suggestion', 'suggestion', '建议反馈', 3),
    ('feedback_type', 'appeal', 'appeal', '申诉', 4),
    ('share_type', 'reminder', 'reminder', '提醒共享', 1),
    ('share_type', 'record', 'record', '记录共享', 2),
    ('msg_type', 'check', 'check', '体检消息', 1),
    ('msg_type', 'reminder', 'reminder', '风险提醒', 2),
    ('msg_type', 'share', 'share', '共享消息', 3),
    ('msg_type', 'feedback', 'feedback', '反馈消息', 4),
    ('msg_type', 'system', 'system', '系统消息', 5);
