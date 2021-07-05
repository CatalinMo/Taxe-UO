package com.uo.taxes.infrastructure;

import com.uo.taxes.domain.ActiveFeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActiveFeeRepository extends JpaRepository<ActiveFeeEntity, Long> {
}
