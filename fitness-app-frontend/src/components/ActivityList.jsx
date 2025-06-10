import { 
  Card, 
  CardContent, 
  Grid2, 
  Typography, 
  Box,
  Chip,
  Fade,
  Skeleton,
  Container,
  Paper
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getActivities } from '../services/api'

// Styled components for modern look
const ModernCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    '&::before': {
      opacity: 1,
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:active': {
    transform: 'translateY(-4px) scale(1.01)',
  }
}))

const ActivityTypeChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: 12,
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  color: 'white',
  fontSize: '0.875rem',
  '& .MuiChip-label': {
    padding: '8px 16px',
  }
}))

const StatsBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(102, 126, 234, 0.1)',
  borderRadius: 12,
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
  border: '1px solid rgba(102, 126, 234, 0.2)',
}))

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8),
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  borderRadius: 20,
  border: '2px dashed rgba(102, 126, 234, 0.3)',
}))

const ActivityList = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const getActivityEmoji = (type) => {
    switch(type) {
      case 'RUNNING': return '🏃‍♂️'
      case 'WALKING': return '🚶‍♂️'
      case 'CYCLING': return '🚴‍♂️'
      default: return '💪'
    }
  }

  const getActivityColor = (type) => {
    switch(type) {
      case 'RUNNING': return 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
      case 'WALKING': return 'linear-gradient(45deg, #A8E6CF, #88D8A3)'
      case 'CYCLING': return 'linear-gradient(45deg, #FFD93D, #FF6B6B)'
      default: return 'linear-gradient(45deg, #667eea, #764ba2)'
    }
  }

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await getActivities()
      setActivities(response.data)
      setError('')
    } catch (error) {
      console.error(error)
      setError('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const LoadingSkeleton = () => (
    <Grid2 container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid2 key={item} xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 4, p: 2 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            <Box sx={{ mt: 2 }}>
              <Skeleton width="60%" height={32} />
              <Skeleton width="80%" height={24} sx={{ mt: 1 }} />
              <Skeleton width="70%" height={24} sx={{ mt: 0.5 }} />
            </Box>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  )

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSkeleton />
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'error.light' }}>
          <Typography variant="h6" color="error">
            ⚠️ {error}
          </Typography>
        </Paper>
      </Container>
    )
  }

  if (activities.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmptyStateContainer>
          <Typography variant="h3" sx={{ mb: 2, opacity: 0.7 }}>
            🏃‍♂️
          </Typography>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>
            No Activities Yet
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.6 }}>
            Start tracking your fitness journey by adding your first activity!
          </Typography>
        </EmptyStateContainer>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Your Activities
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.7 }}>
          {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'} Recorded
        </Typography>
      </Box>

      <Grid2 container spacing={3}>
        {activities.map((activity, index) => (
          <Grid2 key={activity.id} xs={12} sm={6} md={4}>
            <Fade in timeout={600 + (index * 100)}>
              <ModernCard 
                onClick={() => navigate(`/activities/${activity.id}`)}
                sx={{
                  '&::before': {
                    background: getActivityColor(activity.type)
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <ActivityTypeChip 
                      label={`${getActivityEmoji(activity.type)} ${activity.type}`}
                      sx={{ background: getActivityColor(activity.type) }}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      #{activity.id}
                    </Typography>
                  </Box>

                  <StatsBox>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                        Duration
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                        ⏱️ {activity.duration} min
                      </Typography>
                    </Box>
                  </StatsBox>

                  <StatsBox sx={{ mt: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                        Calories Burned
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#f5576c' }}>
                        🔥 {activity.caloriesBurned} cal
                      </Typography>
                    </Box>
                  </StatsBox>

                  {activity.date && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                      <Typography variant="caption" sx={{ opacity: 0.6 }}>
                        📅 {new Date(activity.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </ModernCard>
            </Fade>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  )
}

export default ActivityList