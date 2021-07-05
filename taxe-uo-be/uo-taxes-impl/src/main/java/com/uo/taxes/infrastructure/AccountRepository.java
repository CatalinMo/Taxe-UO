package com.uo.taxes.infrastructure;

import com.uo.taxes.domain.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long> {

    AccountEntity findByEmail(String email);

    AccountEntity findByCnp(String cnp);
}
