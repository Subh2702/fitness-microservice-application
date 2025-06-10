import { 
    Box, 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField,
    Paper,
    Typography,
    Fade,
    CircularProgress,
    Alert
  } from '@mui/material'
  import { styled } from '@mui/material/styles'
  import React, { useState } from 'react'
  import { addActivity } from '../services/api'
  
  // Styled components for modern look
  const ModernPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 20,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: 20,
    }
  }))
  
  const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.7)',
      fontWeight: 500,
    }
  }))
  
  const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      }
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.7)',
      fontWeight: 500,
    }
  }))
  
  const ModernButton = styled(Button)(({ theme }) => ({
    borderRadius: 15,
    padding: '12px 40px',
    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    border: 'none',
    fontWeight: 600,
    fontSize: '1.1rem',
    textTransform: 'none',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 35px rgba(255, 107, 107, 0.6)',
      background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
    },
    '&:active': {
      transform: 'translateY(-1px)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      transition: 'left 0.5s',
    },
    '&:hover::before': {
      left: '100%',
    }
  }))
  
  const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState({
      type: "RUNNING", 
      duration: '', 
      caloriesBurned: '',
      additionalMetrics: {}
    })
    
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
  
    const getActivityEmoji = (type) => {
      switch(type) {
        case 'RUNNING': return '🏃‍♂️'
        case 'WALKING': return '🚶‍♂️'
        case 'CYCLING': return '🚴‍♂️'
        default: return '💪'
      }
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      setError('')
      
      try {
        await addActivity(activity)
        setSuccess(true)
        onActivityAdded()
        setActivity({ type: "RUNNING", duration: '', caloriesBurned: '', additionalMetrics: {} })
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      } catch (error) {
        setError('Failed to add activity. Please try again.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Fade in timeout={800}>
        <ModernPaper elevation={0} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3, 
                color: 'white', 
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              💪 Add New Activity
            </Typography>
  
            {success && (
              <Fade in={success}>
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(76, 175, 80, 0.9)',
                    color: 'white'
                  }}
                >
                  Activity added successfully! 🎉
                </Alert>
              </Fade>
            )}
  
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(244, 67, 54, 0.9)',
                  color: 'white'
                }}
              >
                {error}
              </Alert>
            )}
  
            <Box component="form" onSubmit={handleSubmit}>
              <StyledFormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={activity.type}
                  onChange={(e) => setActivity({...activity, type: e.target.value})}
                  label="Activity Type"
                >
                  <MenuItem value="RUNNING">
                    🏃‍♂️ Running
                  </MenuItem>
                  <MenuItem value="WALKING">
                    🚶‍♂️ Walking
                  </MenuItem>
                  <MenuItem value="CYCLING">
                    🚴‍♂️ Cycling
                  </MenuItem>
                </Select>
              </StyledFormControl>
  
              <StyledTextField 
                fullWidth
                label="Duration (Minutes)"
                type='number'
                sx={{ mb: 3 }}
                value={activity.duration}
                onChange={(e) => setActivity({...activity, duration: e.target.value})}
                InputProps={{
                  inputProps: { min: 0 }
                }}
                required
              />
  
              <StyledTextField 
                fullWidth
                label="Calories Burned"
                type='number'
                sx={{ mb: 4 }}
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}
                InputProps={{
                  inputProps: { min: 0 }
                }}
                required
              />
  
              <Box sx={{ textAlign: 'center' }}>
                <ModernButton 
                  type='submit' 
                  variant='contained'
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Adding...
                    </>
                  ) : (
                    <>
                      💪 Add Activity
                    </>
                  )}
                </ModernButton>
              </Box>
            </Box>
          </Box>
        </ModernPaper>
      </Fade>
    )
  }
  
  export default ActivityForm