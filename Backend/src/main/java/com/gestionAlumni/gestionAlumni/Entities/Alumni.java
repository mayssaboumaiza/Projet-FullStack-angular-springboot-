package com.gestionAlumni.gestionAlumni.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Alumni extends User{

    @Column(nullable = false)
    int graduationYear;

    String currentCompany;

    String currentJob;

    Long salary;
}
