import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getActivityDetail } from '../services/api'
import { 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  Typography, 
  Container,
  Paper,
  Chip,
  IconButton,
  Fade,
  Skeleton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled components for modern look
const HeroCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  }
}))

const ModernCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}))

const StatBox = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 16,
  padding: theme.spacing(2),
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}))

const RecommendationChip = styled(Chip)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
}))

const BackButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  color: 'white',
  marginBottom: theme.spacing(2),
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'scale(1.05)',
  }
}))

const ActivityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      case 'RUNNING': return { bg: '#FF6B6B', light: '#FFE5E5' }
      case 'WALKING': return { bg: '#4ECDC4', light: '#E5F9F7' }
      case 'CYCLING': return { bg: '#FFD93D', light: '#FFF8E1' }
      default: return { bg: '#667eea', light: '#E8ECFF' }
    }
  }

  const calculateCaloriesPerMinute = (calories, duration) => {
    return duration > 0 ? (calories / duration).toFixed(1) : 0
  }

  const getIntensityLevel = (caloriesPerMin) => {
    if (caloriesPerMin >= 15) return { level: 'High', color: '#FF6B6B', progress: 100 }
    if (caloriesPerMin >= 10) return { level: 'Medium', color: '#FFD93D', progress: 70 }
    if (caloriesPerMin >= 5) return { level: 'Low', color: '#4ECDC4', progress: 40 }
    return { level: 'Very Low', color: '#95A5A6', progress: 20 }
  }

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        setLoading(true)
        const response = await getActivityDetail(id)
        setActivity(response.data)
        setRecommendation(response.data.recommendation)
        setError('')
      } catch (error) {
        console.error(error)
        setError('Failed to load activity details')
      } finally {
        setLoading(false)
      }
    }
    fetchActivityDetail()
  }, [id])

  const LoadingSkeleton = () => (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 3 }} />
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 3 }} />
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
    </Container>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 4, mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" onClick={() => navigate(-1)} sx={{ cursor: 'pointer', color: 'primary.main' }}>
            ← Go Back
          </Typography>
        </Box>
      </Container>
    )
  }

  if (!activity) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 4 }}>
          Activity not found
        </Alert>
      </Container>
    )
  }

  const activityColors = getActivityColor(activity.type)
  const caloriesPerMin = calculateCaloriesPerMinute(activity.caloriesBurned, activity.duration)
  const intensity = getIntensityLevel(caloriesPerMin)

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <BackButton onClick={() => navigate(-1)}>
        ← Back
      </BackButton>

      <Fade in timeout={600}>
        <HeroCard>
          <Box sx={{ position: 'relative', zIndex: 2, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 60, height: 60, fontSize: '2rem', bgcolor: 'rgba(255,255,255,0.2)' }}>
                  {getActivityEmoji(activity.type)}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {activity.type}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Activity #{activity.id}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={intensity.level}
                sx={{ 
                  bgcolor: intensity.color, 
                  color: 'white', 
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
              <StatBox>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  ⏱️
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {activity.duration}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Minutes
                </Typography>
              </StatBox>

              <StatBox>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  🔥
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {activity.caloriesBurned}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Calories
                </Typography>
              </StatBox>

              <StatBox>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  ⚡
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {caloriesPerMin}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Cal/Min
                </Typography>
              </StatBox>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                📅 {new Date(activity.createdAt).toLocaleString()}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  Intensity Level
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={intensity.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: intensity.color,
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </HeroCard>
      </Fade>

      {recommendation && (
        <Fade in timeout={800}>
          <ModernCard>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>
                  🤖
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                  AI Fitness Coach
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  📊 Performance Analysis
                </Typography>
                <Paper sx={{ p: 3, bgcolor: '#f8f9ff', borderRadius: 3, border: '1px solid #e8ecff' }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {activity.recommendation}
                  </Typography>
                </Paper>
              </Box>

              {activity?.improvements && activity.improvements.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#FF6B6B' }}>
                    🎯 Areas for Improvement
                  </Typography>
                  <List>
                    {activity.improvements.map((improvement, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#FFE5E5', color: '#FF6B6B' }}>
                            {index + 1}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={improvement}
                          sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {activity?.suggestions && activity.suggestions.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#4ECDC4' }}>
                    💡 Personalized Suggestions
                  </Typography>
                  <List>
                    {activity.suggestions.map((suggestion, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#E5F9F7', color: '#4ECDC4' }}>
                            💡
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={suggestion}
                          sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {activity?.safety && activity.safety.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#FF9500' }}>
                    ⚠️ Safety Guidelines
                  </Typography>
                  <Paper sx={{ p: 3, bgcolor: '#FFF8E1', borderRadius: 3, border: '1px solid #FFE082' }}>
                    <List sx={{ p: 0 }}>
                      {activity.safety.map((safetyTip, index) => (
                        <ListItem key={index} sx={{ pl: 0, pb: 1 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box sx={{ width: 6, height: 6, bgcolor: '#FF9500', borderRadius: '50%' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={safetyTip}
                            sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </ModernCard>
        </Fade>
      )}
    </Container>
  )
}

export default ActivityDetail