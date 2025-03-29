package com.example.bookingcinematicket.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import com.example.bookingcinematicket.utils.EmailValidator;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.AccountDTO;
import com.example.bookingcinematicket.dtos.auth.ChangePasswordRequest;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.AccountRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import com.example.bookingcinematicket.utils.GenerateString;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private JavaMailSender mailSender;

    public SearchResponse<List<AccountDTO>> search(SearchRequest<String, Account> request, Account currentUser) {
        if (request.getCondition() != null)
            request.setCondition(request.getCondition().toLowerCase().trim());
        Page<Account> accounts = accountRepository.search(
                request.getCondition(), currentUser.getAccountId(), request.getPageable(Account.class));
        SearchResponse<List<AccountDTO>> response = new SearchResponse<>();
        response.setData(accounts.getContent().stream()
                .map(item -> {
                    AccountDTO dto = ConvertUtils.convert(item, AccountDTO.class);
                    dto.setPassword(null);
                    return dto;
                })
                .toList());
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(accounts.getTotalElements());
        return response;
    }

    public AccountDTO getById(Long id) {
        Account account =
                accountRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.ACCOUNT_NOT_FOUND));
        account.setPassword(null);
        return ConvertUtils.convert(account, AccountDTO.class);
    }

    public AccountDTO create(AccountDTO dto) {
        log.info("Creating {}", dto);
        boolean exists = accountRepository.existsByEmail(dto.getEmail());
        if (exists) {
            throw new CustomException(SystemMessage.EMAIL_IS_EXISTED);
        }
        if(!EmailValidator.isValidEmail(dto.getEmail())){
            throw new CustomException(SystemMessage.EMAIL_IS_INVALID);
        }
        Account account = ConvertUtils.convert(dto, Account.class);
        String password = GenerateString.randomPassword();
        account.setPassword(passwordEncoder.encode(password));
        accountRepository.save(account);
        account.setPassword(null);
        try {
            sendCodeContent(account, password);
        } catch (MessagingException e) {
            log.error("MessagingException: {}", e.getMessage());
        } catch (UnsupportedEncodingException e) {
            log.error("UnsupportedEncodingException: {}", e.getMessage());
        }
        return ConvertUtils.convert(account, AccountDTO.class);
    }

    public AccountDTO update(Long id, AccountDTO dto) {
        log.info("update {}", dto);
        Account account =
                accountRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.ACCOUNT_NOT_FOUND));

        boolean emailExists = accountRepository.existsByEmailAndAccountIdNot(dto.getEmail(), id);
        if (emailExists) {
            throw new CustomException(SystemMessage.EMAIL_IS_EXISTED);
        }
        if(!EmailValidator.isValidEmail(dto.getEmail())){
            throw new CustomException(SystemMessage.EMAIL_IS_INVALID);
        }
        account.setFullName(dto.getFullName());
        account.setRole(dto.getRole());
        account.setPhone(dto.getPhone());
        account.setEmail(dto.getEmail());
        account.setActive(dto.getActive());
        accountRepository.save(account);
        account.setPassword(null);
        return ConvertUtils.convert(account, AccountDTO.class);
    }

    public void delete(Long id) {
        accountRepository.deleteById(id);
    }

    public void changePassword(ChangePasswordRequest request, Long accountId) {
        request.validateInput();
        Account acc = accountRepository
                .findByAccountId(accountId)
                .orElseThrow(() -> new CustomException(SystemMessage.ACCOUNT_NOT_FOUND));
        if (!passwordEncoder.matches(request.getOldPassword(), acc.getPassword())) {
            throw new CustomException(SystemMessage.OLD_PASSWORD_IS_NOT_CORRECT);
        }
        acc.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(acc);
    }


    public String sendCodeContent(Account user, String code) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = SystemMessage.FROM_ADDRESS;
        String senderName = SystemMessage.SENDER_NAME;
        String subject = SystemMessage.NEW_ACCOUNT_SUBJECT;

        String emailTemplate = """
                            <html>
                            <head>
                                <style>
                                    body {
                                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                                        background-color: #f4f4f4;
                                        margin: 0;
                                        padding: 20px;
                                        line-height: 1.6;
                                    }
                                    .email-container {
                                        max-width: 500px;
                                        margin: 0 auto;
                                        background-color: white;
                                        border-radius: 12px;
                                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                        overflow: hidden;
                                    }
                                    .email-header {
                                        background-color: #f0f0f0;
                                        padding: 20px;
                                        text-align: center;
                                    }
                                    .email-body {
                                        padding: 30px;
                                        text-align: center;
                                    }
                                    .reset-button {
                                        display: inline-block;
                                        background-color: #007bff;
                                        color: white;
                                        padding: 12px 24px;
                                        text-decoration: none;
                                        border-radius: 6px;
                                        margin: 20px 0;
                                        font-weight: bold;
                                    }
                                    .reset-code {
                                        background-color: #f4f4f4;
                                        padding: 15px;
                                        border-radius: 6px;
                                        font-size: 18px;
                                        letter-spacing: 2px;
                                        margin: 20px 0;
                                        display: inline-block;
                                    }
                                    .email-footer {
                                        background-color: #f0f0f0;
                                        padding: 15px;
                                        text-align: center;
                                        font-size: 12px;
                                        color: #666;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="email-container">
                                    <div class="email-header">
                                        <h1 style="margin: 0; color: #333;">Cung cấp tài khoản</h1>
                                    </div>
                                    <div class="email-body">
                                        <p>Xin chào [[fullname]],</p>
                                        <p>Bạn đã được tạo một tài khoản để đăng nhập vào hệ thống đặt vé xem phim.</p>
                                       \s
                                        <div class="reset-code">
                                            [[code]]
                                        </div>
                                       \s
                                    </div>
                                    <div class="email-footer">
                                        © 2025 Hệ Thống Đặt Vé. Bảo mật thông tin.
                                    </div>
                                </div>
                            </body>
                            </html>
                """;
        // Create and send the email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        String emailContent = emailTemplate.replace("[[code]]", code)
                .replace("[[fullname]]", user.getFullName());
        helper.setText(emailContent, true);

        mailSender.send(message);

        return code;
    }
}
