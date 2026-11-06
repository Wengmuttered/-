package com.privacyguard.modules.interpret.repository;

import com.privacyguard.modules.interpret.entity.InterpretTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterpretTaskRepository extends JpaRepository<InterpretTask, Long> {
}
