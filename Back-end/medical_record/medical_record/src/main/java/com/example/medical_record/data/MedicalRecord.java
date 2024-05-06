package com.example.medical_record.data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "medical_record")
public class MedicalRecord {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @Column(name = "patient_id")
        private int patient_id;

        @Column(name = "doctor_id")
        private int doctor_id;

        @Column(name = "description")
        private String description;

        @Column(name = "date")
        private String date;

        public int getId() {
            return id;
        }

        public int getPatient_id() {
            return patient_id;
        }

        public int getDoctor_id() {
            return doctor_id;
        }

        public String getDescription() {
            return description;
        }

        public String getDate() {
            return date;
        }

        public void setId(int id) {
            this.id = id;
        }

        public void setPatient_id(int patient_id) {
            this.patient_id = patient_id;
        }

        public void setDoctor_id(int doctor_id) {
            this.doctor_id = doctor_id;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }

