package com.privacyguard.modules.family.entity;

import com.privacyguard.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * 【家庭设备通讯网段表】
 * 标记特工与特工之间的观察与共享拓扑关系
 */
@Getter
@Setter
@Entity
@Table(name = "family_member")
public class FamilyMember extends BaseEntity {

    /** 发起关系创建的本源节点 ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 加入该网段的子节点或被拉入端 ID */
    @Column(name = "target_user_id", nullable = false)
    private Long targetUserId;

    /** 网段备注，如 "家庭网段A" */
    @Column(name = "relation", length = 64)
    private String relation;
}
