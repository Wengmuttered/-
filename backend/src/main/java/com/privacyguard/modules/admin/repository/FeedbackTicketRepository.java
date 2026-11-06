package com.privacyguard.modules.admin.repository;

import com.privacyguard.modules.admin.entity.FeedbackTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackTicketRepository extends JpaRepository<FeedbackTicket, Long> {
}
