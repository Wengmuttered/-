package com.privacyguard.modules.admin.repository;

import com.privacyguard.modules.admin.entity.SecurityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityRuleRepository extends JpaRepository<SecurityRule, Long> {
}
