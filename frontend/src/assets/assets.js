import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import doc16 from'./doc16.png'
import doc17 from'./doc17.png'
import doc18 from'./doc18.png'
import doc19 from './doc19.png'
import doc20 from './doc20.png'
import doc21 from './doc21.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General Physician',
        image: General_physician
    },
    {
        speciality: 'Gynaecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [

    // ===== GENERAL PHYSICIAN (2 doctors) =====
    {
        _id: 'doc1',
          name: 'Dr. Rohan Verma',
    image: doc1,
    speciality: 'General Physician',
    degree: 'MBBS, MD',
    experience: '10 Years',
    about: 'Experienced General Physician with expertise in preventive healthcare, lifestyle management, and internal medicine.',
    fees: 1000,
    available: true,
    address: {
        line1: 'NovaCare Medical Center',
        line2: 'New Delhi'
    }
},
    {
        _id: 'doc14',
         name: 'Dr. Arjun Mehta',
    image: doc14,
    speciality: 'General Physician',
    degree: 'MBBS, MD (General Medicine)',
    experience: '8 Years',
    about: 'Senior Consultant in Internal Medicine specializing in respiratory disorders, chronic disease management, and comprehensive patient care.',
    fees: 1500,
    available: true,
    address: {
        line1: 'Harmony Healthcare Hospital',
        line2: 'Noida, Uttar Pradesh'
    }
},

    // ===== GYNECOLOGIST (4 doctors) =====
    {
        _id: 'doc2',
       name: 'Dr. Naina Malhotra',
    image: doc2,
    speciality: 'Gynaecologist',
    degree: 'MBBS, MS (Obstetrics & Gynecology)',
    experience: '10 Years',
    about: 'Senior Obstetrics and Gynecology specialist with expertise in high-risk pregnancy management and women’s healthcare.',
    fees: 1000,
    available: true,
    address: {
        line1: 'Sunrise Women Hospital',
        line2: 'Noida, Uttar Pradesh'
    }
},
    {
        _id: 'doc5',
           name: 'Dr. Shalini Bhatia',
    image: doc5,
    speciality: 'Gynaecologist',
    degree: 'MBBS, MS (Gynecology)',
    experience: '9 Years',
    about: 'Experienced Gynecologist specializing in laparoscopic procedures, infertility treatment, and reproductive healthcare.',
    fees: 1000,
    available: true,
    address: {
        line1: 'CarePoint Hospital',
        line2: 'Ghaziabad, Uttar Pradesh'
    }
},
    {
        _id: 'doc9',
         name: 'Dr. Neha Kapoor',
    image: doc9,
    speciality: 'Gynaecologist',
    degree: 'MBBS, MS (Gynecology)',
    experience: '7 Years',
    about: 'Specialist in infertility treatment, PCOS management, laparoscopic surgery, and prenatal and postnatal care.',
    fees: 700,
    available: true,
    address: {
        line1: 'Green Valley Hospital',
        line2: 'Noida, Uttar Pradesh'
    }
},
    {
        _id: 'doc11',
       name: 'Dr. Priya Nair',
    image: doc11,
    speciality: 'Gynaecologist',
    degree: 'MBBS, MS (Obstetrics & Gynecology)',
    experience: '8 Years',
    about: 'Gynaecologist with expertise in pregnancy care, PCOD management, reproductive health, and women’s wellness.',
    fees: 800,
    available: true,
    address: {
        line1: 'LifeBridge Medical Center',
        line2: 'Ghaziabad, Uttar Pradesh'
    }
},


    // ===== DERMATOLOGIST (2 doctors) =====
    {
        _id: 'doc13',
         name: 'Dr. Monika Khurana',
    image: doc13,
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology)',
    experience: '8 Years',
    about: 'Dermatologist specializing in cosmetic dermatology, laser treatments, skin rejuvenation, and hair care.',
    fees: 900,
    available: true,
    address: {
        line1: 'SkinCare Multispecialty Clinic',
        line2: 'Noida, Uttar Pradesh'
    }
},
    {
        _id: 'doc15',
          name: 'Dr. Anjali Mehta',
    image: doc15,
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology)',
    experience: '6 Years',
    about: 'Experienced Dermatologist specializing in skin allergies, pigmentation disorders, acne treatment, and anti-aging procedures.',
    fees: 700,
    available: true,
    address: {
        line1: 'DermaCare Hospital',
        line2: 'New Delhi'
    }
},

    // ===== PEDIATRICIANS (3 doctors) =====
    {
        _id: 'doc19',
         name: 'Dr. Karan Suri',
    image: doc19,
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Pediatrics)',
    experience: '10 Years',
    about: 'Senior Pediatrician specializing in child healthcare, vaccination, growth monitoring, and nutritional guidance.',
    fees: 1500,
    available: true,
    address: {
        line1: 'Children Care Hospital',
        line2: 'New Delhi'
    }
},
    {
        _id: 'doc20',
        name: 'Dr. Amita Sinha',
    image: doc20,
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Pediatrics)',
    experience: '8 Years',
    about: 'Pediatric specialist with expertise in childhood infections, newborn care, and developmental health.',
    fees: 1200,
    available: true,
    address: {
        line1: 'KidsCare Medical Center',
        line2: 'Noida, Uttar Pradesh'
    }
},
    {
        _id: 'doc21',
          name: 'Dr. Satya Prakash',
    image: doc21,
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Pediatrics)',
    experience: '7 Years',
    about: 'Specialist in pediatric healthcare with experience in childhood disorders, nutrition, and preventive medicine.',
    fees: 1000,
    available: true,
    address: {
        line1: 'Sunrise Children Hospital',
        line2: 'Ghaziabad, Uttar Pradesh'
    }
},


    // ===== NEUROLOGIST (2 doctors) =====
    {
        _id: 'doc7',
        name: 'Dr. Vikram Pratap',
    image: doc7,
    speciality: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: '10 Years',
    about: 'Neurologist specializing in brain disorders, stroke management, epilepsy, and neurological rehabilitation.',
    fees: 1500,
    available: true,
    address: {
        line1: 'NeuroCare Institute',
        line2: 'Noida, Uttar Pradesh'
    }
},
    {
        _id: 'doc8',
      name: 'Dr. Vinay Khanna',
    image: doc8,
    speciality: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: '9 Years',
    about: 'Senior Neurologist with expertise in Parkinson’s disease, migraines, epilepsy, and movement disorders.',
    fees: 1200,
    available: true,
    address: {
        line1: 'Brain and Spine Center',
        line2: 'New Delhi'
    }
},

    // ===== GASTROENTEROLOGIST (3 doctors) =====
    {
        _id: 'doc3',
         name: 'Dr. Arun Kumar',
    image: doc3,
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD (Gastroenterology)',
    experience: '9 Years',
    about: 'Gastroenterologist specializing in digestive disorders, obesity management, liver diseases, and gastrointestinal procedures.',
    fees: 1200,
    available: true,
    address: {
        line1: 'Digestive Health Center',
        line2: 'New Delhi'
    }
},
    {
        _id: 'doc6',
       name: 'Dr. Gaurav Saxena',
    image: doc6,
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD (Gastroenterology)',
    experience: '7 Years',
    about: 'Experienced Gastroenterologist specializing in fatty liver disease, hepatitis, inflammatory bowel disease, and endoscopy.',
    fees: 900,
    available: true,
    address: {
        line1: 'WellSpring Hospital',
        line2: 'Noida, Uttar Pradesh'
    }
},
    {
        _id: 'doc10',
         name: 'Dr. Rajeev Tandon',
    image: doc10,
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD (Gastroenterology)',
    experience: '8 Years',
    about: 'Senior Gastroenterologist with expertise in liver disorders, IBS, Crohn’s disease, and digestive healthcare.',
    fees: 1000,
    available: true,
    address: {
        line1: 'Medisphere Hospital',
        line2: 'Ghaziabad, Uttar Pradesh'
    }
}
]