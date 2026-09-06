package com.examly.springapp.repository;

import com.examly.springapp.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByTxnDateDesc(Long userId);
    List<Transaction> findByAccountIdOrderByTxnDateDesc(Long accountId);
    boolean existsByBankReference(String bankReference);
    List<Transaction> findByUserIdAndTxnDateBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
