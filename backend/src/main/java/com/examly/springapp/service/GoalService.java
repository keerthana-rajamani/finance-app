package com.examly.springapp.service;

import com.examly.springapp.dto.GoalRequest;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Goal;
import com.examly.springapp.model.Notification;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.GoalRepository;
import com.examly.springapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuthService authService;

    public Goal createGoal(GoalRequest request) {
        if (request.getTargetAmount() == null || request.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target amount must be a positive number");
        }
        BigDecimal current = request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO;
        if (request.getTargetAmount().compareTo(current) <= 0) {
            throw new IllegalArgumentException("Target amount must exceed current savings");
        }

        User user = authService.getCurrentUser();
        Goal goal = new Goal();
        goal.setUserId(user.getId());
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate() != null ? request.getTargetDate() : LocalDate.now().plusYears(1));
        goal.setCurrentAmount(current);
        goal.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        goal.setStatus("ACTIVE");
        goal.setLinkedAccountId(request.getLinkedAccountId());

        return goalRepository.save(goal);
    }

    public List<Map<String, Object>> getGoalsWithProgress() {
        User user = authService.getCurrentUser();
        List<Goal> list = goalRepository.findByUserId(user.getId());
        List<Map<String, Object>> result = new ArrayList<>();

        LocalDate now = LocalDate.now();

        for (Goal g : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("name", g.getName());
            map.put("targetAmount", g.getTargetAmount());
            map.put("currentAmount", g.getCurrentAmount());
            map.put("targetDate", g.getTargetDate());
            map.put("priority", g.getPriority());
            map.put("status", g.getStatus());

            // Progress percentage
            BigDecimal pct = BigDecimal.ZERO;
            if (g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
                pct = g.getCurrentAmount().divide(g.getTargetAmount(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            }
            map.put("progressPercent", pct.setScale(1, RoundingMode.HALF_UP));

            // Months remaining & monthly savings needed
            long months = ChronoUnit.MONTHS.between(now, g.getTargetDate());
            if (months <= 0) months = 1;
            map.put("monthsRemaining", months);

            BigDecimal needed = g.getTargetAmount().subtract(g.getCurrentAmount());
            if (needed.compareTo(BigDecimal.ZERO) < 0) needed = BigDecimal.ZERO;
            BigDecimal monthlySavingsNeeded = needed.divide(new BigDecimal(months), 2, RoundingMode.HALF_UP);
            map.put("monthlySavingsNeeded", monthlySavingsNeeded);

            // SIP recommendation
            if (months > 36) {
                map.put("sipRecommendation", "Flexi-Cap Equity Mutual Fund (est. 12% p.a.)");
            } else if (months > 12) {
                map.put("sipRecommendation", "Balanced Advantage / Hybrid Fund (est. 9% p.a.)");
            } else {
                map.put("sipRecommendation", "Short-term Debt Fund or Liquid Fund (est. 6.5% p.a.)");
            }

            result.add(map);
        }
        return result;
    }

    public Goal updateGoal(Long id, GoalRequest request) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        if (request.getName() != null) goal.setName(request.getName());
        if (request.getTargetAmount() != null) goal.setTargetAmount(request.getTargetAmount());
        if (request.getTargetDate() != null) goal.setTargetDate(request.getTargetDate());
        if (request.getCurrentAmount() != null) {
            goal.setCurrentAmount(request.getCurrentAmount());
            if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
                goal.setStatus("COMPLETED");
                notificationRepository.save(new Notification(goal.getUserId(), "Goal Achieved!",
                        "Congratulations! You reached 100% of your goal: " + goal.getName(), "GOAL_MILESTONE"));
            }
        }
        if (request.getPriority() != null) goal.setPriority(request.getPriority());

        return goalRepository.save(goal);
    }
}
