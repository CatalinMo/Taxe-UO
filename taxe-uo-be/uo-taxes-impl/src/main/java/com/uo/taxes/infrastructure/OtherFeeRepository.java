package com.uo.taxes.infrastructure;

import com.uo.taxes.domain.OtherFeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtherFeeRepository extends JpaRepository<OtherFeeEntity, Long> {
}
