package com.examly.springapp.service;

import com.examly.springapp.model.Notification;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuthService authService;

    public List<Notification> getNotifications() {
        User user = authService.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public void markAsRead(Long id) {
        User user = authService.getCurrentUser();
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUserId().equals(user.getId())) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    public void markAllAsRead() {
        User user = authService.getCurrentUser();
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }

    public void deleteNotification(Long id) {
        User user = authService.getCurrentUser();
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUserId().equals(user.getId())) {
                notificationRepository.delete(n);
            }
        });
    }

    public void clearAll() {
        User user = authService.getCurrentUser();
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notificationRepository.deleteAll(list);
    }
}
