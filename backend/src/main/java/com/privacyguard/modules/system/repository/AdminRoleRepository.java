package com.privacyguard.modules.system.repository;

import com.privacyguard.modules.system.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 后台角色数据访问层
 */
@Repository
public interface AdminRoleRepository extends JpaRepository<AdminRole, Long> {
}
