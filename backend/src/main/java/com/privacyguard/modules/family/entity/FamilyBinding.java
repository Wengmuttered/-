package com.privacyguard.modules.family.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * 家庭绑定关系实体
 * 存储家庭成员之间的协同绑定关系
 */
@Getter
@Setter
@Entity
@Table(name = "family_binding")
public class FamilyBinding extends BaseEntity {

    /** 发起方用户ID */
    @Column(name = "initiator_id", nullable = false)
    private Long initiatorId;

    /** 接受方用户ID */
    @Column(name = "acceptor_id")
    private Long acceptorId;

    /** 邀请码 */
    @Column(name = "invite_code", length = 32, unique = true)
    private String inviteCode;

    /** 绑定码 */
    @Column(name = "bind_code", length = 32)
    private String bindCode;

    /** 关系类型 */
    @Column(name = "relation_type", length = 20)
    private String relationType = "family";

    /** 状态：0-待确认 1-已绑定 2-已解除 */
    @Column(name = "status", nullable = false)
    private Short status = 0;

    /** 共享策略（JSON） */
    @Column(name = "share_policy", length = 500)
    private String sharePolicy;
}
