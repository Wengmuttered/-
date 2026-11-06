package com.privacyguard.modules.system.repository;

import com.privacyguard.modules.system.entity.AdminAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 后台管理员账号数据访问层
 */
@Repository
public interface AdminAccountRepository extends JpaRepository<AdminAccount, Long> {

    /** 通过登录名查找账号 */
    Optional<AdminAccount> findByLoginName(String loginName);
}
