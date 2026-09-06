package com.examly.springapp.repository;

import com.examly.springapp.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserIdAndMonth(Long userId, LocalDate month);
    List<Budget> findByUserId(Long userId);
    Optional<Budget> findByUserIdAndCategoryAndMonth(Long userId, String category, LocalDate month);
}
