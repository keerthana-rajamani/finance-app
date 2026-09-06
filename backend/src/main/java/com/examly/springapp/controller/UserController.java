package com.examly.springapp.controller;

import com.examly.springapp.model.FamilyMember;
import com.examly.springapp.model.User;
import com.examly.springapp.service.AuthService;
import com.examly.springapp.service.FamilyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private FamilyService familyService;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        User user = authService.getCurrentUser();
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("fullName", user.getFullName());
        map.put("email", user.getEmail());
        map.put("phoneNumber", user.getPhoneNumber());
        map.put("role", user.getRole());
        map.put("hasPanLinked", user.getPanHash() != null);
        map.put("createdAt", user.getCreatedAt());
        return ResponseEntity.ok(map);
    }

    @GetMapping("/family")
    public ResponseEntity<List<FamilyMember>> getFamilyMembers() {
        return ResponseEntity.ok(familyService.getFamilyMembers());
    }

    @PostMapping("/family")
    public ResponseEntity<FamilyMember> inviteFamily(@RequestBody FamilyMember member) {
        return ResponseEntity.ok(familyService.inviteFamilyMember(member));
    }

    @DeleteMapping("/family/{id}")
    public ResponseEntity<Map<String, String>> revokeFamily(@PathVariable Long id) {
        familyService.revokeAccess(id);
        return ResponseEntity.ok(Map.of("message", "Access revoked"));
    }
}
