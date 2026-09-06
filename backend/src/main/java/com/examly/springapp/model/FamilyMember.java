package com.examly.springapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "family_members")
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long primaryUserId;

    private Long memberUserId;

    @Column(nullable = false, length = 100)
    private String memberName;

    @Column(nullable = false, length = 100)
    private String memberEmail;

    @Column(length = 30)
    private String relationship = "SPOUSE";

    @Column(length = 30)
    private String accessScope = "SHARED_BUDGET"; // FULL, VIEW_ONLY, SHARED_BUDGET, MASKED

    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, PENDING, REVOKED

    public FamilyMember() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPrimaryUserId() { return primaryUserId; }
    public void setPrimaryUserId(Long primaryUserId) { this.primaryUserId = primaryUserId; }

    public Long getMemberUserId() { return memberUserId; }
    public void setMemberUserId(Long memberUserId) { this.memberUserId = memberUserId; }

    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }

    public String getMemberEmail() { return memberEmail; }
    public void setMemberEmail(String memberEmail) { this.memberEmail = memberEmail; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public String getAccessScope() { return accessScope; }
    public void setAccessScope(String accessScope) { this.accessScope = accessScope; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
