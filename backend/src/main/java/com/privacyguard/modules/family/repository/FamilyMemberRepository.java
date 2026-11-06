package com.privacyguard.modules.family.repository;

import com.privacyguard.modules.family.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {

    // 抓取出当前设备的所有的从属关联
    List<FamilyMember> findAllByUserId(Long userId);
    
    // 查询出是否存在这个关联线（防止网络攻击重复绑定）
    boolean existsByUserIdAndTargetUserId(Long userId, Long targetUserId);
}
