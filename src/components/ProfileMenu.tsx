// "use client";
// import * as React from "react";
// import Box from "@mui/material/Box";
// import Avatar from "@mui/material/Avatar";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// import PersonIcon from "@mui/icons-material/Person";
// import { useMediaQuery } from "@mui/material";
// import { useLogout, useSession, SessionType } from "@lens-protocol/react-web"; // Import useSession and SessionType
// import Link from "next/link";
// import Image from "next/image";
// import logoutIcon from "../../public/logout-icon.svg";
// import { useProfilePicture } from "../hooks/profilePicture"; // Your custom hook
// import { useUserProfileLink } from "../hooks/useUserProfileLink"; // Your custom hook
// import { ConnectWalletButton } from "./ConnectWalletButton"; // Import the ConnectWalletButton

// const ProfileMenu: React.FC = () => {
//     const { data: session, error, loading } = useSession(); // Get session from Lens
//     console.log(session);
//     const profilePictureUri = useProfilePicture();
//     const profileLink = useUserProfileLink();
//     const { execute } = useLogout();

//     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//     const open = Boolean(anchorEl);
//     const isDesktop = useMediaQuery("(min-width: 768px)");

//     const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     // const handleLogout = () => {
//     //     setAnchorEl(null);
//     //     void execute();
//     // };

//     if (loading) return null; // Show nothing while loading

//     return (
//         <React.Fragment>
//             {session?.authenticated === false ? (
//                 <ConnectWalletButton />
//             ) : (
//                 <>
//                     {isDesktop ? (
//                         <Box>
//                             <Tooltip title="Account settings">
//                                 <IconButton onClick={handleClick} size="small">
//                                     {profilePictureUri ? (
//                                         <Avatar src={profilePictureUri} />
//                                     ) : (
//                                         <Avatar />
//                                     )}
//                                 </IconButton>
//                             </Tooltip>
//                             <Menu
//                                 anchorEl={anchorEl}
//                                 id="account-menu"
//                                 open={open}
//                                 onClose={handleClose}
//                                 PaperProps={{
//                                     elevation: 0,
//                                     sx: {
//                                         bgcolor: "#1F1F1F",
//                                         mt: 1.5,
//                                         "& .MuiAvatar-root": {
//                                             width: 32,
//                                             height: 32,
//                                             ml: -0.5,
//                                             mr: 1,
//                                         },
//                                         "&::before": {
//                                             content: '""',
//                                             display: "block",
//                                             position: "absolute",
//                                             top: 0,
//                                             right: 14,
//                                             width: 10,
//                                             height: 10,
//                                             bgcolor: "#1F1F1F",
//                                             transform: "translateY(-50%) rotate(45deg)",
//                                             zIndex: 0,
//                                         },
//                                     },
//                                 }}
//                                 transformOrigin={{ horizontal: "right", vertical: "top" }}
//                                 anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//                             >
//                                 {profileLink && (
//                                     <Link href={profileLink} passHref>
//                                         <MenuItem onClick={handleClose}>
//                                             <ListItemIcon>
//                                                 <PersonIcon fontSize="small" />
//                                             </ListItemIcon>
//                                             Your Profile
//                                         </MenuItem>
//                                     </Link>
//                                 )}
//                                 {/* <MenuItem onClick={handleLogout}>
//                                     <ListItemIcon>
//                                         <Box>
//                                             <Image
//                                                 src={logoutIcon}
//                                                 style={{ width: "15px", height: "15px" }}
//                                                 alt="logout"
//                                             />
//                                         </Box>
//                                     </ListItemIcon>
//                                     Disconnect
//                                 </MenuItem> */}
//                                 <Divider />

//                             </Menu>
//                         </Box>
//                     ) : (
//                         profileLink && (
//                             <Link href={profileLink} passHref>
//                                 <IconButton size="small">
//                                     {profilePictureUri ? (
//                                         <Avatar src={profilePictureUri} />
//                                     ) : (
//                                         <Avatar />
//                                     )}
//                                 </IconButton>
//                             </Link>
//                         )
//                     )}
//                 </>
//             )}
//         </React.Fragment>
//     );
// };

// export default ProfileMenu;
