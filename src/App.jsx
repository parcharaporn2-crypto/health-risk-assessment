import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Grid,
  Stack,
  TextField,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Button,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Typography,
  Box,
  Divider,
  FormControl,
  FormLabel,
  FormControlLabel,
  InputLabel,
  InputAdornment,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';

// Icons
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PrintIcon from '@mui/icons-material/Print';
import PersonIcon from '@mui/icons-material/Person';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import HeightIcon from '@mui/icons-material/Height';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import CloseIcon from '@mui/icons-material/Close';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HistoryIcon from '@mui/icons-material/History';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

// Create a modern Thai-friendly MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0284c7', // Professional medical teal-blue
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0d9488', // Emerald teal
      light: '#2dd4bf',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Kanit',
      'Prompt',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 22px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

// Disease options
const DISEASE_OPTIONS = [
  { value: 'none', label: 'ไม่มีโรคประจำตัว (None)' },
  { value: 'hypertension', label: 'โรคความดันโลหิตสูง (Hypertension)' },
  { value: 'diabetes', label: 'โรคเบาหวาน (Diabetes Mellitus)' },
  { value: 'heart_disease', label: 'โรคหัวใจและหลอดเลือด (Cardiovascular Disease)' },
  { value: 'dyslipidemia', label: 'โรคไขมันในเลือดสูง (Dyslipidemia)' },
  { value: 'kidney_disease', label: 'โรคไตเรื้อรัง (Chronic Kidney Disease)' },
  { value: 'respiratory', label: 'โรคระบบทางเดินหายใจ / หอบหืด (COPD/Asthma)' },
  { value: 'other', label: 'โรคเรื้อรังอื่นๆ (Other Chronic Diseases)' },
];

export default function App() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    smoking: 'never',
    exercise: 'regular',
    disease: 'none',
  });

  // Validation State
  const [errors, setErrors] = useState({});
  const [alertError, setAlertError] = useState('');

  // Result Dialog State
  const [result, setResult] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('screening_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('screening_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Handle Input Changes
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (alertError) {
      setAlertError('');
    }
  };

  // Input Validation Logic
  const validateForm = () => {
    const newErrors = {};
    const missingFields = [];

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'กรุณากรอกชื่อ-นามสกุล';
      missingFields.push('ชื่อ-นามสกุล');
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'ชื่อ-นามสกุลต้องมีความยาวอย่างน้อย 3 ตัวอักษร';
      missingFields.push('ชื่อ-นามสกุลถูกต้อง');
    }

    // Age
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = 'กรุณากรอกอายุเป็นตัวเลข';
      missingFields.push('อายุ');
    } else if (ageNum <= 0 || ageNum > 120) {
      newErrors.age = 'อายุต้องอยู่ระหว่าง 1 - 120 ปี';
      missingFields.push('อายุที่ถูกต้อง (1-120)');
    }

    // Weight
    const weightNum = Number(formData.weight);
    if (!formData.weight || isNaN(weightNum)) {
      newErrors.weight = 'กรุณากรอกน้ำหนักเป็นตัวเลข';
      missingFields.push('น้ำหนัก');
    } else if (weightNum < 10 || weightNum > 350) {
      newErrors.weight = 'น้ำหนักต้องอยู่ระหว่าง 10 - 350 กก.';
      missingFields.push('น้ำหนักที่ถูกต้อง (10-350)');
    }

    // Height
    const heightNum = Number(formData.height);
    if (!formData.height || isNaN(heightNum)) {
      newErrors.height = 'กรุณากรอกส่วนสูงเป็นตัวเลข';
      missingFields.push('ส่วนสูง');
    } else if (heightNum < 50 || heightNum > 250) {
      newErrors.height = 'ส่วนสูงต้องอยู่ระหว่าง 50 - 250 ซม.';
      missingFields.push('ส่วนสูงที่ถูกต้อง (50-250)');
    }

    setErrors(newErrors);

    if (missingFields.length > 0) {
      setAlertError(
        `พบข้อมูลไม่ถูกต้องหรือช่องว่าง: ${missingFields.join(', ')} กรุณาตรวจสอบและกรอกข้อมูลให้ครบถ้วนก่อนทำการประเมินผล`
      );
      return false;
    }

    setAlertError('');
    return true;
  };

  // BMI & Risk Assessment Logic
  const calculateAssessment = () => {
    if (!validateForm()) return;

    const weightKg = parseFloat(formData.weight);
    const heightCm = parseFloat(formData.height);
    const heightM = heightCm / 100;
    const age = parseInt(formData.age, 10);

    // Calculate BMI
    const bmiRaw = weightKg / (heightM * heightM);
    const bmi = parseFloat(bmiRaw.toFixed(2));

    // Asian BMI Categorization (WHO/สธ.)
    let bmiCategory = '';
    let bmiColor = 'info';
    if (bmi < 18.5) {
      bmiCategory = 'น้ำหนักน้อยกว่าเกณฑ์ (ผอม)';
      bmiColor = 'warning';
    } else if (bmi < 23.0) {
      bmiCategory = 'น้ำหนักปกติ (สมส่วน)';
      bmiColor = 'success';
    } else if (bmi < 25.0) {
      bmiCategory = 'น้ำหนักเกิน (ท้วม)';
      bmiColor = 'warning';
    } else if (bmi < 30.0) {
      bmiCategory = 'โรคอ้วนระดับ 1';
      bmiColor = 'error';
    } else {
      bmiCategory = 'โรคอ้วนระดับ 2 (อันตราย)';
      bmiColor = 'error';
    }

    // Calculate Risk Score & Classification
    // Factors: BMI, Smoking, Chronic Disease, Exercise, Age
    let riskLevel = 'ความเสี่ยงต่ำ (Low Risk)';
    let riskSeverity = 'success';
    let riskPoints = 0;
    const riskReasons = [];

    // BMI risk contribution
    if (bmi >= 30.0) {
      riskPoints += 4;
      riskReasons.push(`ค่า BMI ${bmi} อยู่ในเกณฑ์โรคอ้วนระดับ 2`);
    } else if (bmi >= 25.0) {
      riskPoints += 3;
      riskReasons.push(`ค่า BMI ${bmi} อยู่ในเกณฑ์โรคอ้วนระดับ 1`);
    } else if (bmi >= 23.0) {
      riskPoints += 1.5;
      riskReasons.push(`ค่า BMI ${bmi} เริ่มมีภาวะน้ำหนักเกิน`);
    } else if (bmi < 18.5) {
      riskPoints += 1.5;
      riskReasons.push(`ค่า BMI ${bmi} ต่ำกว่าเกณฑ์มาตรฐาน อาจมีภาวะขาดสารอาหาร`);
    }

    // Smoking risk
    if (formData.smoking === 'regular') {
      riskPoints += 3;
      riskReasons.push('มีพฤติกรรมสูบบุหรี่เป็นประจำ');
    } else if (formData.smoking === 'occasional') {
      riskPoints += 1.5;
      riskReasons.push('มีพฤติกรรมสูบบุหรี่เป็นครั้งคราว');
    }

    // Disease risk
    if (['heart_disease', 'diabetes', 'kidney_disease'].includes(formData.disease)) {
      riskPoints += 4;
      const dLabel = DISEASE_OPTIONS.find((d) => d.value === formData.disease)?.label;
      riskReasons.push(`มีโรคประจำตัวกลุ่มเสี่ยงสูง (${dLabel})`);
    } else if (['hypertension', 'dyslipidemia', 'respiratory', 'other'].includes(formData.disease)) {
      riskPoints += 2.5;
      const dLabel = DISEASE_OPTIONS.find((d) => d.value === formData.disease)?.label;
      riskReasons.push(`มีโรคประจำตัวเรื้อรัง (${dLabel})`);
    }

    // Age risk
    if (age >= 60) {
      riskPoints += 2;
      riskReasons.push('ผู้สูงอายุ (อายุ 60 ปีขึ้นไป)');
    } else if (age >= 45) {
      riskPoints += 1;
    }

    // Exercise risk
    if (formData.exercise === 'none') {
      riskPoints += 1.5;
      riskReasons.push('ขาดการออกกำลังกายสม่ำเสมอ');
    }

    // Final Risk Classification (Low, Moderate, High)
    if (riskPoints >= 4.5 || bmi >= 30 || (bmi >= 25 && formData.smoking === 'regular')) {
      riskLevel = 'ความเสี่ยงสูง (High Risk)';
      riskSeverity = 'error';
    } else if (riskPoints >= 2.0 || bmi >= 23.0 || formData.smoking !== 'never' || formData.disease !== 'none') {
      riskLevel = 'ความเสี่ยงปานกลาง (Moderate Risk)';
      riskSeverity = 'warning';
    } else {
      riskLevel = 'ความเสี่ยงต่ำ (Low Risk)';
      riskSeverity = 'success';
    }

    // Recommendations tailored to risk
    const recommendations = [];
    if (riskSeverity === 'error') {
      recommendations.push({
        title: 'คำแนะนำทางการแพทย์เร่งด่วน',
        desc: 'ควรเข้ารับคำปรึกษาและตรวจสุขภาพโดยแพทย์ผู้เชี่ยวชาญโดยเร็ว พร้อมตรวจเลือดวัดระดับน้ำตาล ไขมัน และการทำงานของตับไต',
      });
      recommendations.push({
        title: 'การปรับเปลี่ยนโภชนาการ',
        desc: 'ลดอาหารหวาน มัน เค็ม หลีกเลี่ยงอาหารทอด แป้งขัดขาว และอาหารแปรรูป รับประทานผักผลไม้ที่มีกากใยสูง',
      });
      if (formData.smoking !== 'never') {
        recommendations.push({
          title: 'การลด ละ เลิกบุหรี่',
          desc: 'ขอคำแนะนำจากคลินิกเลิกบุหรี่ เพื่อลดความเสี่ยงต่อโรคหลอดเลือดหัวใจและมะเร็งปอดทันที',
        });
      }
      recommendations.push({
        title: 'การออกกำลังกายที่ปลอดภัย',
        desc: 'ออกกำลังกายแบบเบาถึงปานกลาง เช่น เดินเร็ว ว่ายน้ำ อย่างน้อยวันละ 30 นาที 5 วัน/สัปดาห์ (ภายใต้คำแนะนำของแพทย์)',
      });
    } else if (riskSeverity === 'warning') {
      recommendations.push({
        title: 'การเฝ้าระวังและตรวจสุขภาพ',
        desc: 'ควรตรวจสุขภาพประจำปีสม่ำเสมอ และตรวจเช็คความดันโลหิตและดัชนีมวลกายทุก 3-6 เดือน',
      });
      recommendations.push({
        title: 'การควบคุมน้ำหนักและอาหาร',
        desc: 'ควบคุมปริมาณแคลอรี่ในแต่ละวัน เน้นอาหารครบ 5 หมู่ ดื่มน้ำสะอาดวันละ 2-3 ลิตร ลดเครื่องดื่มรสหวาน',
      });
      recommendations.push({
        title: 'เพิ่มกิจกรรมทางกาย',
        desc: 'เคลื่อนไหวร่างกายสม่ำเสมอ ออกกำลังกายแบบแอโรบิกร่วมกับเวทเทรนนิ่ง สัปดาห์ละ 150 นาที',
      });
      if (formData.smoking !== 'never') {
        recommendations.push({
          title: 'หลีกเลี่ยงปัจจัยเสี่ยง',
          desc: 'แนะนำให้งดการสูบบุหรี่และหลีกเลี่ยงควันบุหรี่มือสองเพื่อสุขภาพปอดและหลอดเลือดที่ดี',
        });
      }
    } else {
      recommendations.push({
        title: 'การรักษาสุขภาพที่ดีอย่างต่อเนื่อง',
        desc: 'ยอดเยี่ยมมาก! สุขภาพของคุณอยู่ในเกณฑ์ดี ควรรักษารูปแบบการใช้ชีวิต การทานอาหาร และการออกกำลังกายเช่นนี้ต่อไป',
      });
      recommendations.push({
        title: 'ตรวจสุขภาพประจำปี',
        desc: 'ตรวจสุขภาพประจำปีอย่างน้อยปีละ 1 ครั้ง เพื่อเฝ้าระวังสุขภาพในระยะยาว',
      });
      recommendations.push({
        title: 'การจัดการความเครียดและการพักผ่อน',
        desc: 'นอนหลับพักผ่อนให้เพียงพอ 7-8 ชั่วโมงต่อวัน และดื่มน้ำสะอาดอย่างสม่ำเสมอ',
      });
    }

    const screeningRecord = {
      id: `HN-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      patient: { ...formData },
      bmi,
      bmiCategory,
      bmiColor,
      riskLevel,
      riskSeverity,
      riskReasons,
      recommendations,
    };

    setResult(screeningRecord);
    setOpenDialog(true);
    setHistory((prev) => [screeningRecord, ...prev.slice(0, 9)]);
  };

  // Reset Form
  const handleReset = () => {
    setFormData({
      fullName: '',
      gender: 'male',
      age: '',
      weight: '',
      height: '',
      smoking: 'never',
      exercise: 'regular',
      disease: 'none',
    });
    setErrors({});
    setAlertError('');
  };

  // Sample Data Autofill for Demo/Testing
  const handleAutofill = (type) => {
    if (type === 'low') {
      setFormData({
        fullName: 'สมชาย รักสุขภาพ',
        gender: 'male',
        age: '28',
        weight: '65',
        height: '172',
        smoking: 'never',
        exercise: 'regular',
        disease: 'none',
      });
    } else if (type === 'mod') {
      setFormData({
        fullName: 'วิภาดา มั่งมี',
        gender: 'female',
        age: '46',
        weight: '68',
        height: '160',
        smoking: 'occasional',
        exercise: 'occasional',
        disease: 'dyslipidemia',
      });
    } else {
      setFormData({
        fullName: 'ประเสริฐ เจริญสุข',
        gender: 'male',
        age: '58',
        weight: '92',
        height: '168',
        smoking: 'regular',
        exercise: 'none',
        disease: 'hypertension',
      });
    }
    setErrors({});
    setAlertError('');
  };

  // Print Summary Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Header Bar */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
          color: '#ffffff',
          py: 3,
          px: 2,
          mb: 4,
          boxShadow: '0 4px 20px rgba(2, 132, 199, 0.25)',
        }}
        className="no-print"
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  p: 1.5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <MedicalServicesIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" component="h1" fontWeight={700}>
                  ระบบลงทะเบียนและประเมินความเสี่ยงสุขภาพเบื้องต้น
                </Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Patient Health Risk Assessment and Registration System · งานที่ 1
                </Typography>
              </Box>
            </Stack>

            <Chip
              label="MUI React Web App"
              variant="outlined"
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', fontWeight: 500 }}
            />
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ pb: 8 }} className="no-print">
        {/* Validation Alert */}
        {alertError && (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon fontSize="inherit" />}
            sx={{ mb: 3, boxShadow: '0 2px 10px rgba(239, 68, 68, 0.15)' }}
            onClose={() => setAlertError('')}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>ตรวจพบข้อผิดพลาดในการป้อนข้อมูล</AlertTitle>
            {alertError}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Main Assessment Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: { xs: 2.5, md: 4 } }}>
              {/* Form Title & Sample Fill */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1.5}
                sx={{ mb: 3 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    แบบฟอร์มคัดกรองสุขภาพผู้ป่วย
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    กรุณากรอกข้อมูลส่วนบุคคลและข้อมูลสุขภาพเพื่อประเมินความเสี่ยงเบื้องต้น
                  </Typography>
                </Box>

                {/* Autofill test buttons */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', lg: 'block' } }}>
                    ข้อมูลตัวอย่าง:
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleAutofill('low')}
                    startIcon={<AutoFixHighIcon />}
                    sx={{ py: 0.5, px: 1, fontSize: '0.75rem' }}
                  >
                    เสี่ยงต่ำ
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={() => handleAutofill('mod')}
                    sx={{ py: 0.5, px: 1, fontSize: '0.75rem' }}
                  >
                    เสี่ยงกลาง
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleAutofill('high')}
                    sx={{ py: 0.5, px: 1, fontSize: '0.75rem' }}
                  >
                    เสี่ยงสูง
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Box component="form" noValidate>
                {/* Section 1: ข้อมูลส่วนบุคคล */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" fontSize="small" /> 1. ข้อมูลส่วนบุคคล (Personal Information)
                </Typography>

                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                  {/* Full Name */}
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      required
                      label="ชื่อ - นามสกุล"
                      placeholder="เช่น นายสมชาย ใจดี"
                      value={formData.fullName}
                      onChange={handleChange('fullName')}
                      error={Boolean(errors.fullName)}
                      helperText={errors.fullName || 'ระบุชื่อและนามสกุลจริงของผู้รับการคัดกรอง'}
                    />
                  </Grid>

                  {/* Gender */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id="gender-select-label">เพศ</InputLabel>
                      <Select
                        labelId="gender-select-label"
                        id="gender-select"
                        value={formData.gender}
                        label="เพศ"
                        onChange={handleChange('gender')}
                      >
                        <MenuItem value="male">ชาย (Male)</MenuItem>
                        <MenuItem value="female">หญิง (Female)</MenuItem>
                        <MenuItem value="other">อื่นๆ (Other)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Age */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="อายุ"
                      placeholder="เช่น 35"
                      value={formData.age}
                      onChange={handleChange('age')}
                      error={Boolean(errors.age)}
                      helperText={errors.age || 'อายุเต็มปี (1 - 120)'}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">ปี</InputAdornment>,
                        inputProps: { min: 1, max: 120 },
                      }}
                    />
                  </Grid>

                  {/* Weight */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="น้ำหนัก"
                      placeholder="เช่น 65.5"
                      value={formData.weight}
                      onChange={handleChange('weight')}
                      error={Boolean(errors.weight)}
                      helperText={errors.weight || 'น้ำหนักตัวเป็นกิโลกรัม'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MonitorWeightIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">กก.</InputAdornment>,
                        inputProps: { min: 10, max: 350, step: '0.1' },
                      }}
                    />
                  </Grid>

                  {/* Height */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label="ส่วนสูง"
                      placeholder="เช่น 170"
                      value={formData.height}
                      onChange={handleChange('height')}
                      error={Boolean(errors.height)}
                      helperText={errors.height || 'ส่วนสูงเป็นเซนติเมตร'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HeightIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">ซม.</InputAdornment>,
                        inputProps: { min: 50, max: 250, step: '0.5' },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* Section 2: ข้อมูลสุขภาพและพฤติกรรมเสี่ยง */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HealthAndSafetyIcon color="primary" fontSize="small" /> 2. พฤติกรรมความเสี่ยงและโรคประจำตัว (Health Risk Factors)
                </Typography>

                <Grid container spacing={3}>
                  {/* Select: Chronic Disease */}
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="disease-select-label">กลุ่มโรคประจำตัว (Underlying Disease)</InputLabel>
                      <Select
                        labelId="disease-select-label"
                        id="disease-select"
                        value={formData.disease}
                        label="กลุ่มโรคประจำตัว (Underlying Disease)"
                        onChange={handleChange('disease')}
                      >
                        {DISEASE_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* RadioGroup: Smoking Behavior */}
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                          พฤติกรรมการสูบบุหรี่ (Smoking Behavior)
                        </FormLabel>
                        <RadioGroup
                          aria-label="smoking-behavior"
                          name="smoking-radio-group"
                          value={formData.smoking}
                          onChange={handleChange('smoking')}
                        >
                          <FormControlLabel value="never" control={<Radio color="primary" />} label="ไม่เคยสูบ / เลิกสูบแล้ว" />
                          <FormControlLabel value="occasional" control={<Radio color="primary" />} label="สูบเป็นครั้งคราว (Occasional)" />
                          <FormControlLabel value="regular" control={<Radio color="primary" />} label="สูบเป็นประจำทุกวัน (Regular)" />
                        </RadioGroup>
                      </FormControl>
                    </Paper>
                  </Grid>

                  {/* RadioGroup: Physical Activity */}
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                          การออกกำลังกาย (Physical Exercise)
                        </FormLabel>
                        <RadioGroup
                          aria-label="exercise-behavior"
                          name="exercise-radio-group"
                          value={formData.exercise}
                          onChange={handleChange('exercise')}
                        >
                          <FormControlLabel value="regular" control={<Radio color="secondary" />} label="สม่ำเสมอ (>= 3 ครั้ง/สัปดาห์)" />
                          <FormControlLabel value="occasional" control={<Radio color="secondary" />} label="นานๆ ครั้ง (1-2 ครั้ง/สัปดาห์)" />
                          <FormControlLabel value="none" control={<Radio color="secondary" />} label="ไม่ออกกำลังกายเลย" />
                        </RadioGroup>
                      </FormControl>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Action Buttons: Button (ประเมินผล & ล้างข้อมูล) */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<AssessmentIcon />}
                    onClick={calculateAssessment}
                    sx={{ py: 1.5, fontSize: '1.05rem', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)' }}
                  >
                    ประเมินผลความเสี่ยง (Assess Risk)
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<RestartAltIcon />}
                    onClick={handleReset}
                    sx={{ py: 1.5, minWidth: { sm: 160 } }}
                  >
                    ล้างข้อมูล
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Right Side Info Cards */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Reference Card: BMI Criteria */}
              <Paper elevation={1} sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon fontSize="small" /> เกณฑ์ BMI สากลสำหรับเอเชีย
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  สูตร: BMI = น้ำหนัก (kg) / [ส่วนสูง (m)]²
                </Typography>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                    <Typography variant="body2">&lt; 18.5</Typography>
                    <Chip label="ผอม / น้อยกว่าเกณฑ์" size="small" color="warning" variant="outlined" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#ecfdf5', borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={600}>18.5 - 22.9</Typography>
                    <Chip label="น้ำหนักปกติ สมส่วน" size="small" color="success" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#fefce8', borderRadius: 2 }}>
                    <Typography variant="body2">23.0 - 24.9</Typography>
                    <Chip label="น้ำหนักเกิน (ท้วม)" size="small" color="warning" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#fff1f2', borderRadius: 2 }}>
                    <Typography variant="body2">&gt;= 25.0</Typography>
                    <Chip label="โรคอ้วน (เสี่ยงสูง)" size="small" color="error" />
                  </Box>
                </Stack>
              </Paper>

              {/* MUI Components Checklist Card */}
              <Paper elevation={1} sx={{ p: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                  สอดคล้องตามข้อกำหนด MUI:
                </Typography>
                <Stack spacing={0.6}>
                  <Typography variant="caption" color="text.secondary">
                    ✔ <b>Structure:</b> Container, Paper, Grid, Stack
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ✔ <b>Inputs:</b> TextField, RadioGroup, Radio, Select, MenuItem, Button
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ✔ <b>Feedback:</b> Alert, Dialog, DialogTitle, DialogContent, DialogActions, Chip
                  </Typography>
                </Stack>
              </Paper>

              {/* Recent Screenings Mini Table */}
              {history.length > 0 && (
                <Paper elevation={1} sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <HistoryIcon fontSize="small" color="action" /> ประวัติคัดกรองล่าสุด ({history.length})
                    </Typography>
                    <Tooltip title="ลบประวัติทั้งหมด">
                      <IconButton size="small" onClick={() => setHistory([])}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <TableContainer sx={{ maxHeight: 220 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>ชื่อผู้ป่วย</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>BMI</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>ระดับเสี่ยง</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {history.slice(0, 5).map((item) => (
                          <TableRow
                            key={item.id}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              setResult(item);
                              setOpenDialog(true);
                            }}
                          >
                            <TableCell sx={{ fontSize: '0.8rem' }}>{item.patient.fullName}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{item.bmi}</TableCell>
                            <TableCell>
                              <Chip
                                label={item.riskSeverity === 'success' ? 'ต่ำ' : item.riskSeverity === 'warning' ? 'กลาง' : 'สูง'}
                                size="small"
                                color={item.riskSeverity}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Result Dialog (หน้าต่างสรุปผลการประเมิน) */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="assessment-dialog-title"
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'hidden' },
        }}
      >
        {result && (
          <Box id="printable-summary">
            {/* Dialog Header */}
            <DialogTitle
              id="assessment-dialog-title"
              sx={{
                background:
                  result.riskSeverity === 'success'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : result.riskSeverity === 'warning'
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#fff',
                py: 2.5,
                px: 3,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    ใบสรุปผลการคัดกรองความเสี่ยงสุขภาพ
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Screening Summary Report · เลขที่: {result.id} · วันที่: {result.timestamp}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="close"
                  onClick={() => setOpenDialog(false)}
                  sx={{ color: '#fff' }}
                  className="no-print"
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 2.5, md: 3.5 } }}>
              {/* Risk Level Banner */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderColor:
                    result.riskSeverity === 'success'
                      ? '#86efac'
                      : result.riskSeverity === 'warning'
                      ? '#fde68a'
                      : '#fca5a5',
                  bgcolor:
                    result.riskSeverity === 'success'
                      ? '#f0fdf4'
                      : result.riskSeverity === 'warning'
                      ? '#fffbeb'
                      : '#fef2f2',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {result.riskSeverity === 'success' ? (
                        <CheckCircleIcon color="success" sx={{ fontSize: 36 }} />
                      ) : result.riskSeverity === 'warning' ? (
                        <WarningAmberIcon color="warning" sx={{ fontSize: 36 }} />
                      ) : (
                        <ErrorOutlineIcon color="error" sx={{ fontSize: 36 }} />
                      )}
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          ระดับความเสี่ยงสุขภาพของผู้ป่วย
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {result.riskLevel}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                    <Chip
                      label={result.riskLevel}
                      color={result.riskSeverity}
                      icon={
                        result.riskSeverity === 'success' ? (
                          <CheckCircleIcon />
                        ) : result.riskSeverity === 'warning' ? (
                          <WarningAmberIcon />
                        ) : (
                          <ErrorOutlineIcon />
                        )
                      }
                      sx={{ fontWeight: 700, fontSize: '0.9rem', py: 2, px: 1 }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Patient Profile & BMI Grid */}
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* Patient Information */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                        ข้อมูลผู้รับการคัดกรอง
                      </Typography>
                      <Divider sx={{ mb: 1.5 }} />
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">ชื่อ-นามสกุล:</Typography>
                          <Typography variant="body2" fontWeight={600}>{result.patient.fullName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">เพศ / อายุ:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {result.patient.gender === 'male' ? 'ชาย' : result.patient.gender === 'female' ? 'หญิง' : 'อื่นๆ'} / {result.patient.age} ปี
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">น้ำหนัก / ส่วนสูง:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {result.patient.weight} กก. / {result.patient.height} ซม.
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">โรคประจำตัว:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {DISEASE_OPTIONS.find((d) => d.value === result.patient.disease)?.label.split('(')[0]}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">พฤติกรรมสูบบุหรี่:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {result.patient.smoking === 'never'
                              ? 'ไม่สูบ'
                              : result.patient.smoking === 'occasional'
                              ? 'สูบเป็นครั้งคราว'
                              : 'สูบเป็นประจำ'}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* BMI Results */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%', bgcolor: '#f8fafc' }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        ค่าดัชนีมวลกาย (BMI)
                      </Typography>
                      <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ my: 1 }}>
                        {result.bmi}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        กิโลกรัมต่อตารางเมตร (kg/m²)
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={result.bmiCategory}
                          color={result.bmiColor}
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Assessment Reasons / Risk Factors */}
              {result.riskReasons.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
                    ปัจจัยเสี่ยงที่ตรวจพบ:
                  </Typography>
                  <Stack spacing={0.8}>
                    {result.riskReasons.map((reason, idx) => (
                      <Alert key={idx} severity={result.riskSeverity} sx={{ py: 0.5, px: 2 }}>
                        {reason}
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Health Recommendations */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ mb: 1.5 }}>
                  ข้อแนะนำการปฏิบัติตน (Health Recommendations)
                </Typography>
                <Grid container spacing={1.5}>
                  {result.recommendations.map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Paper variant="outlined" sx={{ p: 2, height: '100%', bgcolor: '#ffffff' }}>
                        <Typography variant="subtitle2" fontWeight={700} color="secondary.dark" gutterBottom>
                          {idx + 1}. {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Signature area for print */}
              <Box
                sx={{
                  display: 'none',
                  mt: 4,
                  pt: 2,
                  borderTop: '1px dashed #cbd5e1',
                  textAlign: 'right',
                }}
                className="print-only"
              >
                <Typography variant="body2">ลงชื่อผู้ทำการคัดกรอง: ................................................................</Typography>
                <Typography variant="caption" color="text.secondary">เจ้าหน้าที่คัดกรอง / พยาบาลวิชาชีพ</Typography>
              </Box>
            </DialogContent>

            {/* Dialog Actions (ปุ่มพิมพ์ใบสรุปผล และปิดหน้าต่าง) */}
            <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc' }} className="no-print">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                พิมพ์ใบสรุปผลการคัดกรอง
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpenDialog(false)}
              >
                ปิดหน้าต่าง
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
        className="no-print"
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            ระบบลงทะเบียนและประเมินความเสี่ยงสุขภาพเบื้องต้น (Patient Health Risk Assessment System) · พัฒนาด้วย React & Material-UI (MUI)
          </Typography>
          <Typography variant="caption" color="text.disabled">
            วิทยาลัยเทคนิคอุตรดิตถ์ · ออกแบบเพื่อลดเวลาการทำงานของเจ้าหน้าที่หน้าร้าน
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
