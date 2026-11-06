package com.privacyguard.modules.asset.repository;

import com.privacyguard.modules.asset.entity.AssetAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssetAccountRepository extends JpaRepository<AssetAccount, Long> {
    List<AssetAccount> findAllByUserId(Long userId);
}
