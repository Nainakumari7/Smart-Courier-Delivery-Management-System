import React, { useState } from 'react';
import {
  Box, Paper, Stepper, Step, StepLabel, Button, Typography, TextField, Grid,
  Stack, Alert, Container, Card, CardContent, Divider,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';
import { CheckCircle, ArrowRight, ArrowLeft, MapPin, Package as PackageIcon, Navigation, Info, CreditCard, Wallet } from 'lucide-react';
import { Chip, Tooltip, IconButton } from '@mui/material';

const PRICING_CONFIG = {
  BASE_PRICE: 100,
  WEIGHT_RATE: 50, // per kg
  VOLUMETRIC_DIVISOR: 5000,
  VOLUMETRIC_RATE: 100 // per volumetric kg
};

const calculatePriceDetails = (pkg) => {
  const weight = parseFloat(pkg.weight) || 0;
  const length = parseFloat(pkg.length) || 0;
  const width = parseFloat(pkg.width) || 0;
  const height = parseFloat(pkg.height) || 0;
  const pricePerKg = parseFloat(pkg.pricePerKg) || 70;

  const weightCharge = weight * pricePerKg;
  const volWeight = (length * width * height) / PRICING_CONFIG.VOLUMETRIC_DIVISOR;
  const volCharge = volWeight * PRICING_CONFIG.VOLUMETRIC_RATE;
  
  return {
    base: PRICING_CONFIG.BASE_PRICE,
    weight: weightCharge,
    volumetric: volCharge,
    total: weightCharge + volCharge
  };
};

const steps = ['Origin Address', 'Destination Address', 'Package Details', 'Review & Confirm'];

const AddressForm = ({ section, label, formData, updateField }) => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <MapPin size={20} color="#059669" /> {label}
    </Typography>
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <TextField
          fullWidth label="Street Address" required
          value={formData[section].street}
          onChange={(e) => updateField(section, 'street', e.target.value)}
          placeholder="123 Main Street, Apt 4B"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="City" required
          value={formData[section].city}
          onChange={(e) => updateField(section, 'city', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="State / Province" required
          value={formData[section].state}
          onChange={(e) => updateField(section, 'state', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="ZIP / Postal Code" required
          value={formData[section].zipCode}
          onChange={(e) => updateField(section, 'zipCode', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="Country" required
          value={formData[section].country}
          onChange={(e) => updateField(section, 'country', e.target.value)}
        />
      </Grid>
    </Grid>
  </Box>
);

const CreateDelivery = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const [formData, setFormData] = useState({
    originAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
    destinationAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
    pkg: { description: '', weight: '', pricePerKg: '70', length: '', width: '', height: '' },
  });

  const handleNext = () => {
    if (activeStep === 0) {
      const { street, city, state, zipCode, country } = formData.originAddress;
      if (!street || !city || !state || !zipCode || !country) {
        setError("Please fill out all fields for the Origin Address.");
        return;
      }
    } else if (activeStep === 1) {
      const { street, city, state, zipCode, country } = formData.destinationAddress;
      if (!street || !city || !state || !zipCode || !country) {
        setError("Please fill out all fields for the Destination Address.");
        return;
      }
    } else if (activeStep === 2) {
      const { description, weight, pricePerKg } = formData.pkg;
      if (!description || !weight || parseFloat(weight) <= 0 || !pricePerKg || parseFloat(pricePerKg) <= 0) {
        setError("Please provide a description, weight, and valid price for the package.");
        return;
      }
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!window.Razorpay) {
      setError("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const priceDetails = calculatePriceDetails(formData.pkg);
      const totalPrice = priceDetails.total;

      // 1. Create Razorpay Order via Backend
      const orderResponse = await axiosInstance.post('/payments/create-order', {
        amount: totalPrice,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      });

      // The backend returns a JSON string from Razorpay Order object
      const orderData = typeof orderResponse.data === 'string' ? JSON.parse(orderResponse.data) : orderResponse.data;

      // 2. Configure Razorpay Options
      const options = {
        key: "rzp_test_SkYr7Zhbkxavkz", // Test Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Smart Courier",
        description: `Payment for delivery of ${formData.pkg.description}`,
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          try {
            await axiosInstance.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            // 4. If verification succeeds, create the actual delivery
            const payload = {
              userId: user.id,
              pkg: {
                description: formData.pkg.description,
                weight: parseFloat(formData.pkg.weight) || 0,
                pricePerKg: parseFloat(formData.pkg.pricePerKg) || 70,
                totalPrice: totalPrice,
                length: parseFloat(formData.pkg.length) || null,
                width: parseFloat(formData.pkg.width) || null,
                height: parseFloat(formData.pkg.height) || null,
              },
              originAddress: formData.originAddress,
              destinationAddress: formData.destinationAddress,
            };

            const deliveryResponse = await axiosInstance.post('/deliveries', payload);
            navigate(`/customer/track/${deliveryResponse.data.trackingNumber}`);
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || 'Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || user?.username || "",
          email: user?.email || "",
          contact: ""
        },
        theme: {
          color: "#059669",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };


  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm section="originAddress" label="Pickup (Origin) Address" formData={formData} updateField={updateField} />;
      case 1:
        return <AddressForm section="destinationAddress" label="Delivery (Destination) Address" formData={formData} updateField={updateField} />;
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PackageIcon size={20} color="#059669" /> Package Details
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Description" required multiline rows={2}
                  value={formData.pkg.description}
                  onChange={(e) => updateField('pkg', 'description', e.target.value)}
                  placeholder="e.g., Electronics, Books, Clothing..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Weight (kg)" type="number" required
                  value={formData.pkg.weight}
                  onChange={(e) => updateField('pkg', 'weight', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#F0FDF4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', borderColor: '#BBF7D0' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Estimated Delivery Price</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>
                      Rs {calculatePriceDetails(formData.pkg).total.toFixed(2)}
                    </Typography>
                  </Box>
                  <Tooltip title="Base Fee (₹100) + Weight (₹50/kg) + Volumetric Surcharge">
                    <IconButton size="small"><Info size={16} /></IconButton>
                  </Tooltip>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Length (cm)" type="number"
                  value={formData.pkg.length}
                  onChange={(e) => updateField('pkg', 'length', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Width (cm)" type="number"
                  value={formData.pkg.width}
                  onChange={(e) => updateField('pkg', 'width', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Height (cm)" type="number"
                  value={formData.pkg.height}
                  onChange={(e) => updateField('pkg', 'height', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        const priceDetails = calculatePriceDetails(formData.pkg);
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>Review Your Shipment</Typography>
            <Stack spacing={3}>
              {/* Route summary - Matching screenshot */}
              <Paper
                elevation={0}
                sx={{
                  p: 3, borderRadius: 3,
                  bgcolor: '#F8FAFC',
                  border: '1px solid', borderColor: 'divider',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>FROM</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formData.originAddress.city}, {formData.originAddress.state}</Typography>
                    <Typography variant="caption" color="text.secondary">{formData.originAddress.street}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex' }}>
                      <Navigation size={20} color="#10B981" style={{ transform: 'rotate(90deg)' }} />
                    </Box>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>TO</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formData.destinationAddress.city}, {formData.destinationAddress.state}</Typography>
                    <Typography variant="caption" color="text.secondary">{formData.destinationAddress.street}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Package Details - Matching screenshot */}
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>PACKAGE</Typography>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderStyle: 'dashed' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{formData.pkg.description || "Books"}</Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Weight:</strong> {formData.pkg.weight} kg
                    </Typography>
                    {(formData.pkg.length || formData.pkg.width || formData.pkg.height) && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Dimensions:</strong> {formData.pkg.length || 0} x {formData.pkg.width || 0} x {formData.pkg.height || 0} cm
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Price (Rs {formData.pkg.pricePerKg}/kg)
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      Rs {priceDetails.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Payment Method - NEW SECTION */}
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>PAYMENT METHOD</Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2, borderRadius: 3, mb: 1,
                        borderColor: paymentMethod === 'razorpay' ? 'primary.main' : 'divider',
                        bgcolor: paymentMethod === 'razorpay' ? 'rgba(5, 150, 105, 0.02)' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <FormControlLabel
                        value="razorpay"
                        control={<Radio color="primary" />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ p: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2, display: 'flex' }}>
                              <CreditCard size={20} color="#3B82F6" />
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>Razorpay</Typography>
                              <Typography variant="caption" color="text.secondary">Pay securely via Cards, UPI, or NetBanking</Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  </RadioGroup>
                </FormControl>
              </Box>
            </Stack>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
              Create New Delivery
            </Typography>
            <Typography color="text.secondary">Fill in the details to schedule your shipment</Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

          <Box sx={{ minHeight: 300 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              startIcon={<ArrowLeft size={18} />}
              sx={{ fontWeight: 600 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={loading}
              endIcon={activeStep === steps.length - 1 ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
              sx={{ px: 4 }}
            >
              {activeStep === steps.length - 1 ? (loading ? 'Processing...' : 'Pay & Create Delivery') : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </AnimatedPage>
  );
};

export default CreateDelivery;
