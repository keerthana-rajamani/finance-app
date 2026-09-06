package com.examly.springapp.config;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private FamilyMemberRepository familyMemberRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            // 1. Seed Users (Roles from Appendix A)
            User user = new User("John Doe", "john@example.com", "9876543210", passwordEncoder.encode("Password@123"), "USER");
            user.setPanHash("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
            userRepository.save(user);

            User family = new User("Sarah Doe", "sarah@example.com", "9876543211", passwordEncoder.encode("Password@123"), "FAMILY_MEMBER");
            userRepository.save(family);

            User advisor = new User("Robert Smith", "advisor@example.com", "9876543212", passwordEncoder.encode("Password@123"), "FINANCIAL_ADVISOR");
            userRepository.save(advisor);

            User support = new User("Alice Support", "support@example.com", "9876543213", passwordEncoder.encode("Password@123"), "SUPPORT");
            userRepository.save(support);

            User admin = new User("System Admin", "admin@example.com", "9876543214", passwordEncoder.encode("Password@123"), "ADMIN");
            userRepository.save(admin);

            // 2. Seed Accounts for John
            Account hdfc = new Account();
            hdfc.setUserId(user.getId());
            hdfc.setBankName("HDFC Bank");
            hdfc.setAccountType("SAVINGS");
            hdfc.setMaskedNumber("••••4521");
            hdfc.setBalance(new BigDecimal("142500.00"));
            accountRepository.save(hdfc);

            Account icici = new Account();
            icici.setUserId(user.getId());
            icici.setBankName("ICICI Bank");
            icici.setAccountType("CURRENT");
            icici.setMaskedNumber("••••8912");
            icici.setBalance(new BigDecimal("78400.00"));
            accountRepository.save(icici);

            Account axisCard = new Account();
            axisCard.setUserId(user.getId());
            axisCard.setBankName("Axis Bank Credit Card");
            axisCard.setAccountType("CREDIT");
            axisCard.setMaskedNumber("••••3489");
            axisCard.setBalance(new BigDecimal("18600.00"));
            accountRepository.save(axisCard);

            Account demat = new Account();
            demat.setUserId(user.getId());
            demat.setBankName("Zerodha Broking (CDSL)");
            demat.setAccountType("DEMAT");
            demat.setMaskedNumber("••••9014");
            demat.setBalance(new BigDecimal("524000.00"));
            accountRepository.save(demat);

            // 3. Seed Budgets
            LocalDate curMonth = LocalDate.now().withDayOfMonth(1);
            budgetRepository.save(createBudget(user.getId(), "Food", curMonth, new BigDecimal("12000.00"), new BigDecimal("9850.00"), 80));
            budgetRepository.save(createBudget(user.getId(), "Transport", curMonth, new BigDecimal("5000.00"), new BigDecimal("3200.00"), 80));
            budgetRepository.save(createBudget(user.getId(), "Utilities", curMonth, new BigDecimal("7000.00"), new BigDecimal("5400.00"), 80));
            budgetRepository.save(createBudget(user.getId(), "Shopping", curMonth, new BigDecimal("10000.00"), new BigDecimal("10200.00"), 80)); // overspent!
            budgetRepository.save(createBudget(user.getId(), "Healthcare", curMonth, new BigDecimal("6000.00"), new BigDecimal("1500.00"), 80));
            budgetRepository.save(createBudget(user.getId(), "Entertainment", curMonth, new BigDecimal("4000.00"), new BigDecimal("2800.00"), 80));

            // 4. Seed Transactions
            LocalDateTime now = LocalDateTime.now();
            transactionRepository.save(createTxn(hdfc.getId(), user.getId(), "TXN-SAL-001", new BigDecimal("125000.00"), "CREDIT", "Income", "Tech Corp Salary", "Monthly Salary Credit", now.minusDays(5), new BigDecimal("0.999")));
            transactionRepository.save(createTxn(hdfc.getId(), user.getId(), "TXN-SWG-002", new BigDecimal("850.00"), "DEBIT", "Food", "Swiggy", "Dinner order", now.minusDays(1), new BigDecimal("0.985")));
            transactionRepository.save(createTxn(hdfc.getId(), user.getId(), "TXN-UBR-003", new BigDecimal("420.00"), "DEBIT", "Transport", "Uber India", "Cab ride to office", now.minusDays(2), new BigDecimal("0.970")));
            transactionRepository.save(createTxn(axisCard.getId(), user.getId(), "TXN-AMZ-004", new BigDecimal("4599.00"), "DEBIT", "Shopping", "Amazon.in", "Electronics and cables", now.minusDays(3), new BigDecimal("0.940")));
            transactionRepository.save(createTxn(hdfc.getId(), user.getId(), "TXN-ELE-005", new BigDecimal("1650.00"), "DEBIT", "Utilities", "Bescom Electricity", "Monthly power bill", now.minusDays(4), new BigDecimal("0.990")));
            transactionRepository.save(createTxn(hdfc.getId(), user.getId(), "TXN-NF-006", new BigDecimal("649.00"), "DEBIT", "Entertainment", "Netflix", "Monthly subscription", now.minusDays(6), new BigDecimal("0.960")));
            transactionRepository.save(createTxn(hdfc.getId(), user.getId(), "TXN-APL-007", new BigDecimal("1200.00"), "DEBIT", "Healthcare", "Apollo Pharmacy", "Prescription medicines", now.minusDays(7), new BigDecimal("0.950")));

            // 5. Seed Goals
            Goal g1 = new Goal();
            g1.setUserId(user.getId());
            g1.setName("Home Down Payment");
            g1.setTargetAmount(new BigDecimal("1500000.00"));
            g1.setCurrentAmount(new BigDecimal("650000.00"));
            g1.setTargetDate(LocalDate.now().plusMonths(24));
            g1.setPriority("HIGH");
            g1.setStatus("ACTIVE");
            goalRepository.save(g1);

            Goal g2 = new Goal();
            g2.setUserId(user.getId());
            g2.setName("Emergency Fund (6 Months)");
            g2.setTargetAmount(new BigDecimal("300000.00"));
            g2.setCurrentAmount(new BigDecimal("210000.00"));
            g2.setTargetDate(LocalDate.now().plusMonths(6));
            g2.setPriority("HIGH");
            g2.setStatus("ACTIVE");
            goalRepository.save(g2);

            Goal g3 = new Goal();
            g3.setUserId(user.getId());
            g3.setName("Japan Vacation");
            g3.setTargetAmount(new BigDecimal("350000.00"));
            g3.setCurrentAmount(new BigDecimal("120000.00"));
            g3.setTargetDate(LocalDate.now().plusMonths(14));
            g3.setPriority("MEDIUM");
            g3.setStatus("ACTIVE");
            goalRepository.save(g3);

            // 6. Seed Bills
            Bill b1 = new Bill();
            b1.setUserId(user.getId());
            b1.setName("Bescom Electricity Bill");
            b1.setCategory("Utilities");
            b1.setAmount(new BigDecimal("1650.00"));
            b1.setDueDay(12);
            b1.setDueDate(LocalDate.now().plusDays(3));
            b1.setStatus("PENDING");
            billRepository.save(b1);

            Bill b2 = new Bill();
            b2.setUserId(user.getId());
            b2.setName("Airtel Fiber Broadband");
            b2.setCategory("Utilities");
            b2.setAmount(new BigDecimal("999.00"));
            b2.setDueDay(18);
            b2.setDueDate(LocalDate.now().plusDays(6));
            b2.setStatus("PENDING");
            billRepository.save(b2);

            Bill b3 = new Bill();
            b3.setUserId(user.getId());
            b3.setName("Axis Bank Credit Card Bill");
            b3.setCategory("Credit");
            b3.setAmount(new BigDecimal("18600.00"));
            b3.setDueDay(22);
            b3.setDueDate(LocalDate.now().plusDays(10));
            b3.setStatus("PENDING");
            billRepository.save(b3);

            // 7. Seed Investments
            investmentRepository.save(createInv(user.getId(), "EQUITY", "Reliance Industries Ltd", new BigDecimal("50"), new BigDecimal("2400.00"), new BigDecimal("2980.00")));
            investmentRepository.save(createInv(user.getId(), "EQUITY", "Tata Consultancy Services", new BigDecimal("30"), new BigDecimal("3500.00"), new BigDecimal("4150.00")));
            investmentRepository.save(createInv(user.getId(), "MUTUAL_FUND", "Parag Parikh Flexi Cap Fund", new BigDecimal("1250.45"), new BigDecimal("48.20"), new BigDecimal("72.60")));
            investmentRepository.save(createInv(user.getId(), "MUTUAL_FUND", "Mirae Asset ELSS Tax Saver", new BigDecimal("800.00"), new BigDecimal("32.50"), new BigDecimal("45.10")));
            investmentRepository.save(createInv(user.getId(), "GOLD", "Sovereign Gold Bond 2028", new BigDecimal("25"), new BigDecimal("4800.00"), new BigDecimal("7250.00")));

            // 8. Seed Family Member
            FamilyMember fm = new FamilyMember();
            fm.setPrimaryUserId(user.getId());
            fm.setMemberUserId(family.getId());
            fm.setMemberName("Sarah Doe");
            fm.setMemberEmail("sarah@example.com");
            fm.setRelationship("SPOUSE");
            fm.setAccessScope("SHARED_BUDGET");
            fm.setStatus("ACTIVE");
            familyMemberRepository.save(fm);

            // 9. Seed Notifications
            notificationRepository.save(new Notification(user.getId(), "Budget Alert (Shopping)", "You have exceeded your monthly Shopping budget of ₹10,000 (Current spend: ₹10,200)", "BUDGET_ALERT"));
            notificationRepository.save(new Notification(user.getId(), "Bill Due in 3 Days", "Bescom Electricity Bill of ₹1,650 is due on " + LocalDate.now().plusDays(3), "BILL_DUE"));
            notificationRepository.save(new Notification(user.getId(), "Goal Milestone", "You have reached 70% of your Emergency Fund goal!", "GOAL_MILESTONE"));
        };
    }

    private Budget createBudget(Long uid, String cat, LocalDate m, BigDecimal budget, BigDecimal spent, int alert) {
        Budget b = new Budget();
        b.setUserId(uid);
        b.setCategory(cat);
        b.setMonth(m);
        b.setBudgetAmount(budget);
        b.setSpentAmount(spent);
        b.setAlertAtPercent(alert);
        b.setCarryForward(false);
        return b;
    }

    private Transaction createTxn(Long accId, Long uid, String ref, BigDecimal amt, String type, String cat, String merch, String desc, LocalDateTime dt, BigDecimal conf) {
        Transaction t = new Transaction();
        t.setAccountId(accId);
        t.setUserId(uid);
        t.setBankReference(ref);
        t.setAmount(amt);
        t.setType(type);
        t.setCategory(cat);
        t.setMerchant(merch);
        t.setDescription(desc);
        t.setTxnDate(dt);
        t.setConfidenceScore(conf);
        t.setIsReviewed(true);
        return t;
    }

    private Investment createInv(Long uid, String type, String name, BigDecimal units, BigDecimal buy, BigDecimal nav) {
        Investment inv = new Investment();
        inv.setUserId(uid);
        inv.setAssetType(type);
        inv.setAssetName(name);
        inv.setUnits(units);
        inv.setBuyPrice(buy);
        inv.setCurrentNav(nav);
        inv.setTotalValue(units.multiply(nav));
        inv.setXirr(new BigDecimal("14.50"));
        return inv;
    }
}
