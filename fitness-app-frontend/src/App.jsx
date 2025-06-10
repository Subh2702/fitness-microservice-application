import { 
  Box, 
  Button, 
  Typography, 
  Container,
  Paper,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Fade,
  CircularProgress,
  Card,
  CardContent
} from "@mui/material"
import { styled } from '@mui/material/styles'
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-oauth2-code-pkce"
import { useDispatch } from "react-redux"
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from "react-router"
import { setCredentials } from "./store/authSlice"
import ActivityForm from "./components/ActivityForm"
import ActivityList from "./components/ActivityList"
import ActivityDetail from "./components/ActivityDetail"

// Styled components for modern look
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
  }
}))

const LoginCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  zIndex: 2,
  maxWidth: 400,
  width: '100%',
  margin: theme.spacing(0, 2),
}))

const ModernButton = styled(Button)(({ theme }) => ({
  borderRadius: 15,
  padding: '12px 40px',
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  border: 'none',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
    background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
  }
}))

const LogoutButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '8px 20px',
  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
  }
}))

const ModernAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  color: '#333',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}))

const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%),
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)
  `,
  backgroundBlendMode: 'multiply, normal, normal',
}))

const WelcomeSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  borderRadius: 24,
  margin: theme.spacing(4, 0),
}))

// Navigation Header Component
const NavigationHeader = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const getUserInitials = (user) => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <ModernAppBar position="sticky" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/activities')}
          >
            💪 FitTracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {location.pathname !== '/activities' && (
            <Button 
              onClick={() => navigate('/activities')}
              sx={{ 
                color: '#667eea', 
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' }
              }}
            >
              🏠 Home
            </Button>
          )}
          
          <IconButton onClick={handleMenu} sx={{ p: 0 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                fontWeight: 600
              }}
            >
              {getUserInitials(user)}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 1 }}
          >
            <MenuItem sx={{ minWidth: 200, flexDirection: 'column', alignItems: 'start', pb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {user?.email}
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); onLogout(); }}>
              <LogoutButton size="small" fullWidth>
                🚪 Logout
              </LogoutButton>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </ModernAppBar>
  )
}

// Modern Activities Page
const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleActivityAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <MainContainer>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <WelcomeSection>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Welcome to Your Fitness Journey! 🏋️‍♂️
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7 }}>
            Track your activities, monitor progress, and get AI-powered insights
          </Typography>
        </WelcomeSection>

        <ActivityForm onActivityAdded={handleActivityAdded} />
        <ActivityList key={refreshKey} />
      </Container>
    </MainContainer>
  )
}

// Loading Component
const LoadingScreen = () => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}
  >
    <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
    <Typography variant="h6">Loading your fitness journey...</Typography>
  </Box>
)

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext)
  const dispatch = useDispatch()
  const [authReady, setAuthReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        dispatch(setCredentials({ token, user: tokenData }))
      }
      setAuthReady(true)
      setLoading(false)
    }, 1000) // Small delay for smooth loading experience

    return () => clearTimeout(timer)
  }, [token, tokenData, dispatch])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      {!token ? (
        <LoginContainer>
          <Fade in timeout={800}>
            <LoginCard>
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: '3rem',
                    mb: 2
                  }}
                >
                  💪
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  FitTracker
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#333',
                    mb: 1
                  }}
                >
                  Your Personal Fitness Journey
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.7,
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  Track workouts, monitor progress, and get AI-powered insights to achieve your fitness goals
                </Typography>
              </Box>

              <ModernButton 
                variant="contained" 
                size="large" 
                fullWidth
                onClick={() => logIn()}
                sx={{ mb: 2 }}
              >
                🚀 Start Your Journey
              </ModernButton>

              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                Secure login powered by OAuth2
              </Typography>
            </LoginCard>
          </Fade>
        </LoginContainer>
      ) : (
        <MainContainer>
          <NavigationHeader user={tokenData} onLogout={logOut} />
          
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route 
              path="/" 
              element={
                token ? (
                  <Navigate to="/activities" replace />
                ) : (
                  <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h5">Welcome! Please Login.</Typography>
                  </Container>
                )
              } 
            />
          </Routes>
        </MainContainer>
      )}
    </Router>
  )
}

export default App