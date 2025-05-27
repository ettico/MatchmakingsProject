// "use client"
// import { useState } from "react"
// import type React from "react"

// import { Box, Paper, Typography, Grid, Tabs, Tab, Chip, Button, IconButton, styled } from "@mui/material"
// import {
//   Person as PersonIcon,
//   LocationOn as LocationIcon,
//   Cake as CakeIcon,
//   School as SchoolIcon,
//   Work as WorkIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   Favorite as HeartIcon,
//   Book as BookIcon,
//   Flag as FlagIcon,
//   Visibility as EyeIcon,
//   AutoAwesome as SparklesIcon,
//   Check as CheckIcon,
//   Close as CloseIcon,
//   School as GraduationCapIcon,
// } from "@mui/icons-material"
// import { Male, Women } from "../Models"
// // import type { Candidate } from "@/lib/types"

// interface CandidateDetailProps {
//   candidate: Male|Women
//   onStatusChange: (id: number, status: string) => void
//   onClose: () => void
// }

// interface TabPanelProps {
//   children?: React.ReactNode
//   index: number
//   value: number
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props

//   return (
//     <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   )
// }

// const SectionTitle = styled(Typography)(({ theme }) => ({
//   fontSize: "1.125rem",
//   fontWeight: 600,
//   marginBottom: theme.spacing(2),
//   display: "flex",
//   alignItems: "center",
//   "& .MuiSvgIcon-root": {
//     marginRight: theme.spacing(1),
//     color: theme.palette.text.secondary,
//   },
// }))

// const InfoLabel = styled(Typography)(({ theme }) => ({
//   fontSize: "0.875rem",
//   color: theme.palette.text.secondary,
// }))

// const InfoValue = styled(Typography)(({ theme }) => ({
//   fontSize: "1rem",
// }))

// const InfoItem = styled(Box)(({ theme }) => ({
//   marginBottom: theme.spacing(1),
// }))

// const StatusButton = styled(Button, {
//   shouldForwardProp: (prop) => prop !== "isActive",
// })<{ isActive: boolean }>(({ theme, isActive }) => ({
//   justifyContent: "flex-start",
//   ...(isActive && {
//     backgroundColor: theme.palette.success.light,
//     color: theme.palette.success.dark,
//     "&:hover": {
//       backgroundColor: theme.palette.success.main,
//       color: theme.palette.success.contrastText,
//     },
//   }),
// }))

// const StatusButtonNegative = styled(Button, {
//   shouldForwardProp: (prop) => prop !== "isActive",
// })<{ isActive: boolean }>(({ theme, isActive }) => ({
//   justifyContent: "flex-start",
//   ...(isActive && {
//     backgroundColor: theme.palette.error.light,
//     color: theme.palette.error.dark,
//     "&:hover": {
//       backgroundColor: theme.palette.error.main,
//       color: theme.palette.error.contrastText,
//     },
//   }),
// }))

// export default function CandidateDetail({ candidate, onStatusChange, onClose }: CandidateDetailProps) {
//   const [tabValue, setTabValue] = useState(0)
//   const isMale = candidate.role === "male"

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   const handleStatusChange = (newStatus: string) => {
//     onStatusChange(candidate.id, newStatus)
//   }

//   return (
//     <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: "100%" }}>
//       {/* Close button */}
//       <IconButton sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }} onClick={onClose}>
//         <CloseIcon />
//       </IconButton>

//       {/* Sidebar with profile summary */}
//       <Box
//         sx={{
//           width: { xs: "100%", md: "33%" },
//           p: 3,
//           bgcolor: isMale ? "#eff6ff" : "#fff1f2",
//           borderTopLeftRadius: { md: 12 },
//           borderBottomLeftRadius: { md: 12 },
//         }}
//       >
//         <Box sx={{ textAlign: "center", mb: 4 }}>
//           <Box sx={{ mx: "auto", mb: 2 }}>
//             <Box
//               sx={{
//                 width: 128,
//                 height: 128,
//                 borderRadius: "50%",
//                 mx: "auto",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 bgcolor: isMale ? "#3b82f6" : "#f43f5e",
//                 color: "white",
//               }}
//             >
//               <PersonIcon sx={{ fontSize: 64 }} />
//             </Box>
//           </Box>

//           <Typography variant="h5" fontWeight="bold" mb={0.5}>
//             {candidate.firstName} {candidate.lastName}
//           </Typography>
//           <Box
//             sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, color: "text.secondary" }}
//           >
//             <LocationIcon fontSize="small" />
//             <Typography variant="body1">
//               {candidate.city}, {candidate.country}
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <CakeIcon sx={{ color: "text.secondary" }} />
//             <Box>
//               <InfoLabel>גיל</InfoLabel>
//               <InfoValue>{candidate.age}</InfoValue>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <SchoolIcon sx={{ color: "text.secondary" }} />
//             <Box>
//               <InfoLabel>השכלה</InfoLabel>
//               <InfoValue sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                 {isMale ? candidate.bigYeshiva || candidate.smallYeshiva : candidate.seminar || candidate.highSchool}
//               </InfoValue>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <HeartIcon sx={{ color: "text.secondary" }} />
//             <Box>
//               <InfoLabel>חוג</InfoLabel>
//               <InfoValue>{candidate.club || candidate.class}</InfoValue>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <WorkIcon sx={{ color: "text.secondary" }} />
//             <Box>
//               <InfoLabel>עיסוק</InfoLabel>
//               <InfoValue>{isMale ? candidate.occupation : candidate.currentOccupation}</InfoValue>
//             </Box>
//           </Box>
//         </Box>

//         <Box sx={{ mt: 4 }}>
//           <Typography variant="body2" color="text.secondary" mb={1}>
//             סטטוס נוכחי
//           </Typography>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//             <StatusButton
//               variant={candidate.status === "פנוי להצעות" ? "contained" : "outlined"}
//               isActive={candidate.status === "פנוי להצעות"}
//               onClick={() => handleStatusChange("פנוי להצעות")}
//               startIcon={<CheckCircleIcon />}
//             >
//               פנוי להצעות
//             </StatusButton>

//             <StatusButtonNegative
//               variant={candidate.status === "לא פנוי להצעות" ? "contained" : "outlined"}
//               isActive={candidate.status === "לא פנוי להצעות"}
//               onClick={() => handleStatusChange("לא פנוי להצעות")}
//               startIcon={<CancelIcon />}
//             >
//               לא פנוי להצעות
//             </StatusButtonNegative>
//           </Box>
//         </Box>
//       </Box>

//       {/* Main content */}
//       <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           textColor="primary"
//           indicatorColor="primary"
//           sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
//         >
//           <Tab label="פרטים אישיים" />
//           <Tab label="השכלה ורקע" />
//           <Tab label="מראה חיצוני" />
//           <Tab label="ציפיות מבן/בת הזוג" />
//         </Tabs>

//         <TabPanel value={tabValue} index={0}>
//           <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//             <SectionTitle>
//               <PersonIcon /> פרטים אישיים
//             </SectionTitle>

//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>מספר זהות</InfoLabel>
//                   <InfoValue>{candidate.tz}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>תאריך לידה</InfoLabel>
//                   <InfoValue>{candidate.burnDate}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>כתובת</InfoLabel>
//                   <InfoValue>{candidate.address}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>עיר</InfoLabel>
//                   <InfoValue>{candidate.city}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>מדינה</InfoLabel>
//                   <InfoValue>{candidate.country}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>חוג</InfoLabel>
//                   <InfoValue>{candidate.class}</InfoValue>
//                 </InfoItem>
//               </Grid>
//             </Grid>
//           </Paper>

//           <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//             <SectionTitle>
//               <BookIcon /> רקע
//             </SectionTitle>

//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>רקע</InfoLabel>
//                   <InfoValue>{candidate.backGround}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>פתיחות</InfoLabel>
//                   <InfoValue>{candidate.openness}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               {candidate.anOutsider && (
//                 <Grid item xs={12}>
//                   <InfoItem>
//                     <InfoLabel>מידע נוסף</InfoLabel>
//                     <InfoValue>{candidate.anOutsider}</InfoValue>
//                   </InfoItem>
//                 </Grid>
//               )}
//             </Grid>
//           </Paper>

//           <Paper sx={{ p: 3, borderRadius: 2 }}>
//             <SectionTitle>
//               <FlagIcon /> פרטים נוספים
//             </SectionTitle>

//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>מצב בריאותי</InfoLabel>
//                   <InfoValue>{candidate.healthCondition ? "כן" : "לא"}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>סטטוס</InfoLabel>
//                   <InfoValue>{candidate.status}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               {isMale ? (
//                 <>
//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>רשיון נהיגה</InfoLabel>
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         {candidate.driversLicense ? (
//                           <CheckIcon sx={{ color: "success.main", mr: 0.5, fontSize: 18 }} />
//                         ) : (
//                           <CloseIcon sx={{ color: "error.main", mr: 0.5, fontSize: 18 }} />
//                         )}
//                         <InfoValue>{candidate.driversLicense ? "יש" : "אין"}</InfoValue>
//                       </Box>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>מעשן</InfoLabel>
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         {candidate.smoker ? (
//                           <CheckIcon sx={{ color: "success.main", mr: 0.5, fontSize: 18 }} />
//                         ) : (
//                           <CloseIcon sx={{ color: "error.main", mr: 0.5, fontSize: 18 }} />
//                         )}
//                         <InfoValue>{candidate.smoker ? "כן" : "לא"}</InfoValue>
//                       </Box>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>זקן</InfoLabel>
//                       <InfoValue>{candidate.beard}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>כובע</InfoLabel>
//                       <InfoValue>{candidate.hot}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>חליפה</InfoLabel>
//                       <InfoValue>{candidate.suit}</InfoValue>
//                     </InfoItem>
//                   </Grid>
//                 </>
//               ) : (
//                 <Grid item xs={12} md={6}>
//                   <InfoItem>
//                     <InfoLabel>כיסוי ראש</InfoLabel>
//                     <InfoValue>{candidate.headCovering}</InfoValue>
//                   </InfoItem>
//                 </Grid>
//               )}
//             </Grid>
//           </Paper>
//         </TabPanel>

//         <TabPanel value={tabValue} index={1}>
//           <Paper sx={{ p: 3, borderRadius: 2 }}>
//             <SectionTitle>
//               <GraduationCapIcon /> {isMale ? "רקע ישיבתי" : "רקע השכלתי"}
//             </SectionTitle>

//             <Grid container spacing={2}>
//               {isMale ? (
//                 <>
//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>ישיבה קטנה</InfoLabel>
//                       <InfoValue>{candidate.smallYeshiva}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>ישיבה גדולה</InfoLabel>
//                       <InfoValue>{candidate.bigYeshiva}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>קיבוץ</InfoLabel>
//                       <InfoValue>{candidate.kibbutz}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>עיסוק</InfoLabel>
//                       <InfoValue>{candidate.occupation}</InfoValue>
//                     </InfoItem>
//                   </Grid>
//                 </>
//               ) : (
//                 <>
//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>תיכון</InfoLabel>
//                       <InfoValue>{candidate.highSchool}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>סמינר</InfoLabel>
//                       <InfoValue>{candidate.seminar}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>מסלול לימודי</InfoLabel>
//                       <InfoValue>{candidate.studyPath}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>מוסד לימודי נוסף</InfoLabel>
//                       <InfoValue>{candidate.additionalEducationalInstitution}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>עיסוק כיום</InfoLabel>
//                       <InfoValue>{candidate.currentOccupation}</InfoValue>
//                     </InfoItem>
//                   </Grid>
//                 </>
//               )}
//             </Grid>
//           </Paper>
//         </TabPanel>

//         <TabPanel value={tabValue} index={2}>
//           <Paper sx={{ p: 3, borderRadius: 2 }}>
//             <SectionTitle>
//               <EyeIcon /> מראה חיצוני
//             </SectionTitle>

//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>גובה</InfoLabel>
//                   <InfoValue>{candidate.height} ס"מ</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>מראה כללי</InfoLabel>
//                   <InfoValue>{candidate.generalAppearance}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>צבע פנים</InfoLabel>
//                   <InfoValue>{candidate.facePaint}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>מראה</InfoLabel>
//                   <InfoValue>{candidate.appearance}</InfoValue>
//                 </InfoItem>
//               </Grid>
//             </Grid>
//           </Paper>
//         </TabPanel>

//         <TabPanel value={tabValue} index={3}>
//           <Paper sx={{ p: 3, borderRadius: 2 }}>
//             <SectionTitle>
//               <SparklesIcon /> {isMale ? "ציפיות מבת הזוג" : "ציפיות מבן הזוג"}
//             </SectionTitle>

//             <Grid container spacing={2}>
//               {isMale && (
//                 <Grid item xs={12} md={6}>
//                   <InfoItem>
//                     <InfoLabel>ציפיות מהשותף</InfoLabel>
//                     <InfoValue>{candidate.expectationsFromPartner}</InfoValue>
//                   </InfoItem>
//                 </Grid>
//               )}

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>חוג</InfoLabel>
//                   <InfoValue>{candidate.club}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>גיל מינימלי</InfoLabel>
//                   <InfoValue>{candidate.ageFrom}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>גיל מקסימלי</InfoLabel>
//                   <InfoValue>{candidate.ageTo}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>תכונות חשובות בי</InfoLabel>
//                   <InfoValue>{candidate.importantTraitsInMe}</InfoValue>
//                 </InfoItem>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <InfoItem>
//                   <InfoLabel>תכונות חשובות שאני מחפש</InfoLabel>
//                   <InfoValue>
//                     {isMale ? candidate.importantTraitsIAmLookingFor : candidate.importantTraitsIMLookingFor}
//                   </InfoValue>
//                 </InfoItem>
//               </Grid>

//               {isMale ? (
//                 <>
//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>סגנון סמינר מועדף</InfoLabel>
//                       <InfoValue>{candidate.preferredSeminarStyle}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>מסלול מקצועי מועדף</InfoLabel>
//                       <InfoValue>{candidate.preferredProfessionalPath}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>כיסוי ראש</InfoLabel>
//                       <InfoValue>{candidate.headCovering}</InfoValue>
//                     </InfoItem>
//                   </Grid>
//                 </>
//               ) : (
//                 <>
//                   <Grid item xs={12} md={6}>
//                     <InfoItem>
//                       <InfoLabel>סגנון הישיבות המועדף</InfoLabel>
//                       <InfoValue>{candidate.preferredSittingStyle}</InfoValue>
//                     </InfoItem>
//                   </Grid>

//                   <Grid item xs={12}>
//                     <InfoLabel sx={{ mb: 1 }}>מעוניינת שהבחור יהיה</InfoLabel>
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                       <Chip
//                         label="רשיון נהיגה"
//                         color={candidate.drivingLicense ? "primary" : "default"}
//                         variant={candidate.drivingLicense ? "filled" : "outlined"}
//                         icon={candidate.drivingLicense ? <CheckIcon /> : <CloseIcon />}
//                       />

//                       <Chip
//                         label="לא מעשן"
//                         color={candidate.smoker ? "primary" : "default"}
//                         variant={candidate.smoker ? "filled" : "outlined"}
//                         icon={candidate.smoker ? <CheckIcon /> : <CloseIcon />}
//                       />

//                       <Chip label={`זקן: ${candidate.beard}`} variant="outlined" />

//                       <Chip label={`כובע: ${candidate.hat}`} variant="outlined" />

//                       <Chip label={`חליפה: ${candidate.suit}`} variant="outlined" />

//                       <Chip label={`עיסוק: ${candidate.occupation}`} variant="outlined" />
//                     </Box>
//                   </Grid>
//                 </>
//               )}
//             </Grid>
//           </Paper>
//         </TabPanel>
//       </Box>
//     </Box>
//   )
// }
