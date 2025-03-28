package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.dtos.auth.LoginResponse;
import com.example.bookingcinematicket.utils.GenerateString;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.bookingcinematicket.config.jwt.JwtUtil;
import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.AccountRepository;

import java.io.UnsupportedEncodingException;

@Service
@Slf4j
public class AuthService {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    public LoginResponse login(String email, String password, HttpServletResponse response) {
        try {
            Account account = accountRepository.findByEmail(email);
            if (account == null || !passwordEncoder.matches(password, account.getPassword()))
                return new LoginResponse(SystemMessage.INCORRECT_EMAIL_OR_PASSWORD, null);
            if (!account.getActive()) return new LoginResponse(SystemMessage.INACTIVE_ACCOUNT, null);
            String token = jwtUtil.generateToken(email);

            Cookie cookie = new Cookie(SystemMessage.KEY_COOKIE_JWT, token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);
            return new LoginResponse("", account.getRole());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new LoginResponse(e.getMessage(), null);
        }
    }

    public void register(Account user) {
        Account account = accountRepository.findByEmail(user.getEmail());
        if (account != null) {
            throw new CustomException(SystemMessage.EMAIL_IS_EXISTED);
        }
        user.setActive(true);
        user.setAccountId(null);
        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        accountRepository.save(user);
    }
    public void sendCodeForgotPass(String email) throws MessagingException, UnsupportedEncodingException {
        log.info("Send mail when forgot pass: ");
        var foundUserByEmail = accountRepository.findByEmail(email);
        if (foundUserByEmail == null) {
            throw new CustomException(SystemMessage.EMAIL_IS_NOT_CORRECT);
        }
        var rawCode = GenerateString.randomCode(6);
        var encode = passwordEncoder.encode(rawCode);
        foundUserByEmail.setPassword(encode);
        accountRepository.save(foundUserByEmail);
        sendCodeContent(foundUserByEmail, rawCode);
    }

    public String sendCodeContent(Account user, String code) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = SystemMessage.FROM_ADDRESS;
        String senderName = SystemMessage.SENDER_NAME;
        String subject = SystemMessage.PASSWORD_SUBJECT;

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
                                        <h1 style="margin: 0; color: #333;">Đặt Lại Mật Khẩu</h1>
                                    </div>
                                    <div class="email-body">
                                        <p>Xin chào [[fullname]],</p>
                                        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                                       \s
                                        <div class="reset-code">
                                            [[code]]
                                        </div>
                                       \s
                                        <p>Nếu bạn không yêu cầu việc đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
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
