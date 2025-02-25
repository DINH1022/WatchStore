import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StoreIcon from "@mui/icons-material/Store";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import { People as PeopleIcon } from "@mui/icons-material";

import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Account from "../User/Account";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const isLoggedIn = !!(
    sessionStorage.getItem("userData") || localStorage.getItem("userData")
  );

  React.useEffect(() => {
    const userData = JSON.parse(
      localStorage.getItem("userData") || sessionStorage.getItem("userData")
    );
    if (userData) {
      setUser(userData);
    }
  }, []);

  // When user logs in, update the avatar in storage
  const updateUserData = (userData) => {
    if (userData.avatar) {
      const storage = localStorage.getItem("userData")
        ? localStorage
        : sessionStorage;
      storage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    }
  };

  React.useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleStorageChange = () => {
      const userData = JSON.parse(
        localStorage.getItem("userData") || sessionStorage.getItem("userData")
      );
      if (userData) {
        setUser(userData);
      }
    };

    const handleAvatarChange = (event) => {
      const newAvatar = event.detail.avatar;
      setUser((prev) => (prev ? { ...prev, avatar: newAvatar } : prev));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("avatarChange", handleAvatarChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("avatarChange", handleAvatarChange);
    };
  }, []);

  const handleNavigation = (path) => {
    if (
      (path == "/favorites" ||
        path == "/orders" ||
        path == "/transaction-history") &&
      !isLoggedIn
    ) {
      navigate("/login");
      return;
    }
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  // const navigationItems = [
  //   { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
  //   { text: 'Sản phẩm', icon: <StoreIcon />, path: '/products' },
  //   { text: 'Giỏ hàng', icon: <ShoppingCartIcon />, path: '/cart' },
  //   { text: 'Yêu thích', icon: <FavoriteIcon />, path: '/favorites' },
  //   { text: 'Lịch sử đơn hàng', icon: <ReceiptIcon />, path: '/orders' },
  //   { text: 'Lịch sử thanh toán', icon: <AccountBalanceWalletIcon />, path: '/transaction-history' },
  //   ...(user?.isAdmin ? [
  //     { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  //     { text: 'Quản lý người dùng', icon: <PeopleIcon />, path: '/users'},
  //     { text: 'Quản lý đơn hàng', icon: <ShoppingCartIcon />, path: '/admin/orders'},
  //     { text: 'Quản lý danh mục', icon: <CategoryIcon />, path: '/categories' },
  //     { text: 'Quản lý sản phẩm', icon: <InventoryIcon />, path: '/admin/products' },
  //   ] : []),
  //   ...(!user ? [{ text: 'Login', icon: <LoginIcon />, path: '/login' }] : []),
  // ];

  const userNavigationItems = [
    { text: "Trang chủ", icon: <HomeIcon />, path: "/" },
    { text: "Sản phẩm", icon: <StoreIcon />, path: "/products" },
    { text: "Giỏ hàng", icon: <ShoppingCartIcon />, path: "/cart" },
    { text: "Yêu thích", icon: <FavoriteIcon />, path: "/favorites" },
    { text: "Lịch sử đơn hàng", icon: <ReceiptIcon />, path: "/orders" },
    {
      text: "Lịch sử thanh toán",
      icon: <AccountBalanceWalletIcon />,
      path: "/transaction-history",
    },
  ];

  const adminNavigationItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Quản lý người dùng", icon: <PeopleIcon />, path: "/users" },
    {
      text: "Quản lý đơn hàng",
      icon: <ShoppingCartIcon />,
      path: "/admin/orders",
    },
    { text: "Quản lý danh mục", icon: <CategoryIcon />, path: "/categories" },
    {
      text: "Quản lý sản phẩm",
      icon: <InventoryIcon />,
      path: "/admin/products",
    },
  ];

  // Chọn mảng phù hợp dựa trên trạng thái người dùng
  const navigationItems = user
    ? user.isAdmin
      ? [...adminNavigationItems]
      : [...userNavigationItems]
    : [
        ...userNavigationItems,
        { text: "Login", icon: <LoginIcon />, path: "/login" },
      ];

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ display: "flex" }}>
        <Drawer variant="permanent" open={open}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              p: 1,
            }}
          >
            <IconButton onClick={() => setOpen(!open)}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Divider />
            <List>
              {navigationItems.map((item) => (
                <ListItem
                  key={item.text}
                  disablePadding
                  sx={{ display: "block" }}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 56,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      "&:hover": {
                        backgroundColor: "rgba(26, 35, 126, 0.04)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "#1a237e",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        color: "#1a237e",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            {user && (
              <Account
                username={user.username}
                email={user.email}
                avatar={user.avatar}
                open={open}
              />
            )}
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
