package com.examly.springapp.service;

import com.examly.springapp.model.FamilyMember;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.FamilyMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FamilyService {

    @Autowired
    private FamilyMemberRepository familyMemberRepository;

    @Autowired
    private AuthService authService;

    public FamilyMember inviteFamilyMember(FamilyMember member) {
        User user = authService.getCurrentUser();
        member.setPrimaryUserId(user.getId());
        member.setStatus("ACTIVE");
        return familyMemberRepository.save(member);
    }

    public List<FamilyMember> getFamilyMembers() {
        User user = authService.getCurrentUser();
        return familyMemberRepository.findByPrimaryUserId(user.getId());
    }

    public void revokeAccess(Long memberId) {
        familyMemberRepository.findById(memberId).ifPresent(m -> {
            m.setStatus("REVOKED");
            familyMemberRepository.save(m);
        });
    }
}
