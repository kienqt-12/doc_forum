import React, { useState } from 'react';
import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import Avatar from '@mui/material/Avatar';
import { ReactComponent as logo } from '~/assets/logo.svg';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import SearchApp from '~/components/Search';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../../context/AuthContext';
import { Button, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Logout, Settings, Person } from '@mui/icons-material';
import useNavigation from '../../hooks/useNavigation';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import NotiDropdown from './NotiDropdown/notiDropdown';
import FriendList from './Friendlist/friendlist';
import ChatBox from '../ChatBox';

function AppBar() {
  const { user, logout } = useAuth();
  const { goToLogin, goToProfile } = useNavigation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };
  const handleSettings = () => {
    console.log('Go to settings');
    handleMenuClose();
  };

  const [notiOpen, setNotiOpen] = useState(false);
  const toggleNotiDropdown = () => setNotiOpen((prev) => !prev);
  const handleClickAway = () => setNotiOpen(false);

  const [friendOpen, setFriendOpen] = useState(false);
  const toggleFriendDropdown = () => setFriendOpen((prev) => !prev);
  const handleFriendClickAway = () => setFriendOpen(false);

  const [chatFriend, setChatFriend] = useState(null);
  const handleOpenChat = (friend) => setChatFriend(friend);
  const handleCloseChat = () => setChatFriend(null);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.appCustom.appBar.backgroundColor,
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Logo */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }}>
        <SvgIcon component={logo} inheritViewBox sx={{ color: '#fff', fontSize: 30 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
          Doc-forum
        </Typography>
      </Box>

      <SearchApp />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Friend Icon & Dropdown */}
        <ClickAwayListener onClickAway={handleFriendClickAway}>
          <Box sx={{ position: 'relative' }}>
            <Tooltip title="Đã theo dõi">
              <PeopleIcon
                onClick={toggleFriendDropdown}
                sx={{
                  color: '#fff',
                  fontSize: 30,
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#9C27B0',
                  },
                }}
              />
            </Tooltip>

            {friendOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  zIndex: 1500,
                }}
              >
                <FriendList onChatClick={handleOpenChat} />
              </Box>
            )}

            {chatFriend && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '120%',
                  right: 360,
                  zIndex: 1600,
                }}
              >
                <ChatBox friend={chatFriend} onClose={handleCloseChat} />
              </Box>
            )}
          </Box>
        </ClickAwayListener>

        {/* Notification */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ position: 'relative' }}>
            <Tooltip title="Thông báo">
              <Badge color="error" variant="dot">
                <NotificationsActiveOutlinedIcon
                  onClick={toggleNotiDropdown}
                  sx={{
                    color: '#fff',
                    fontSize: 30,
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#9C27B0',
                    },
                  }}
                />
              </Badge>
            </Tooltip>

            {notiOpen && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  zIndex: 1500,
                }}
              >
                <NotiDropdown />
              </Box>
            )}
          </Box>
        </ClickAwayListener>

        {/* Avatar hoặc Đăng nhập */}
        {user ? (
          <>
            <Tooltip title={user.name}>
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                onClick={handleAvatarClick}
              />
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  mt: 1.5,
                  minWidth: 180,
                  '& .MuiAvatar-root': {
                    width: 28,
                    height: 28,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                onClick={() => {
                  goToProfile(user._id);
                  handleMenuClose();
                }}
              >
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Trang cá nhân
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Cài đặt
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                backgroundColor: '#ffffff22',
                borderColor: '#fff',
              },
            }}
            onClick={goToLogin}
          >
            Đăng nhập với Google
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default AppBar;
