// import { useWeb3Modal } from '@web3modal/wagmi/react';
// import { Button } from "@mui/material";
// import { useAccount, useDisconnect } from "wagmi";
// import { useEffect } from 'react';

// export function ConnectWalletButton() {
//   const { open } = useWeb3Modal();
//   const { isConnected, address } = useAccount();
//   const { disconnect } = useDisconnect();

//   useEffect(() => {
//     // Log the connection status to debug the issue
//     console.log("Wallet connection status:", isConnected);
//     console.log("Wallet address:", address);
//   }, [isConnected, address]);

//   const handleClick = () => {
//     if (isConnected) {
//       disconnect();
//     } else {
//       open();
//     }
//   };

//   return (
//     <>
//       {isConnected ? (
//         // Display a custom button for disconnecting the wallet
//         <Button
//           onClick={handleClick}
//           variant="contained"
//           sx={{
//             color: "#D9D9D9",
//             fontSize: {
//               sm: "12px",
//               xs: "10px",
//             },
//             backgroundColor: '#1F1F1F',
//             borderRadius: "12px",
//             padding: { xs: "8px", sm: "8px" },
//             display: 'flex',
//             alignItems: 'center',
//             marginBottom: "8px",
//             textTransform: "capitalize",
//           }}
//         >
//           Disconnect
//         </Button>
//       ) : (
//         // Display the login button if not connected
//         <Button
//           onClick={handleClick}
//           variant="contained"
//           sx={{
//             color: "#D9D9D9",
//             fontSize: {
//               sm: "12px",
//               xs: "10px",
//             },
//             backgroundColor: '#1F1F1F',
//             borderRadius: "12px",
//             padding: { xs: "8px", sm: "8px" },
//             display: 'flex',
//             alignItems: 'center',
//             marginBottom: "8px",
//             textTransform: "capitalize",
//           }}
//         >
//           Login
//         </Button>
//       )}
//     </>
//   );
// }
