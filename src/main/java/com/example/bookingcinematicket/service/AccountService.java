package com.example.bookingcinematicket.service;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.AccountDTO;
import com.example.bookingcinematicket.dtos.BranchDTO;
import com.example.bookingcinematicket.dtos.auth.ChangePasswordRequest;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Account;
import com.example.bookingcinematicket.entity.Branch;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.AccountRepository;
import com.example.bookingcinematicket.repository.BranchRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;
import com.example.bookingcinematicket.utils.GenerateString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public SearchResponse<List<AccountDTO>> search(SearchRequest<String, Account> request, Account currentUser) {
        if(request.getCondition() != null)
            request.setCondition(request.getCondition().toLowerCase().trim());
        Page<Account> accounts = accountRepository.search(
                request.getCondition(),
                currentUser.getAccountId(),
                request.getPageable(Account.class)
        );
        SearchResponse<List<AccountDTO>> response = new SearchResponse<>();
        response.setData(
                accounts.getContent().stream()
                    .map(item -> {
                        AccountDTO dto = ConvertUtils.convert(item, AccountDTO.class);
                        dto.setPassword(null);
                        return dto;
                    })
                    .toList()
        );
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(accounts.getTotalElements());
        return response;
    }

    public AccountDTO getById(Long id) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.ACCOUNT_NOT_FOUND));
        account.setPassword(null);
        return ConvertUtils.convert(account, AccountDTO.class);
    }

    public AccountDTO create(AccountDTO dto) {
        log.info("Creating {}", dto);
        boolean exists = accountRepository.existsByEmail(dto.getEmail());
        if (exists) {
            throw new CustomException(SystemMessage.EMAIL_IS_EXISTED);
        }
        Account account = ConvertUtils.convert(dto, Account.class);
        String password = GenerateString.randomPassword();
        account.setPassword(passwordEncoder.encode(password));
        accountRepository.save(account);
        account.setPassword(null);
        return ConvertUtils.convert(account, AccountDTO.class);
    }

    public AccountDTO update(Long id, AccountDTO dto) {
        log.info("update {}", dto);
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new CustomException(SystemMessage.ACCOUNT_NOT_FOUND));

        boolean emailExists = accountRepository.existsByEmailAndAccountIdNot(dto.getEmail(), id);
        if (emailExists) {
            throw new CustomException(SystemMessage.EMAIL_IS_EXISTED);
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

    public void changePassword(ChangePasswordRequest request, Long accountId){
        request.validateInput();
        Account acc = accountRepository.findByAccountId(accountId).orElseThrow(
                () -> new CustomException(SystemMessage.ACCOUNT_NOT_FOUND)
        );
        if(!passwordEncoder.matches(request.getOldPassword(), acc.getPassword())){
            throw new CustomException(SystemMessage.OLD_PASSWORD_IS_NOT_CORRECT);
        }
        acc.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(acc);
    }

}
