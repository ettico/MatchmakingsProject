// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, CardContent, CircularProgress, Typography } from '@mui/material';
// import { Contact, FamilyDetails, Male, Women } from '../Models';

// const Details = () => {
//     const { role, id } = useParams();
//     const [Women, setWomen] = useState<Women>();
//     const [Male, setmale] = useState<Male>();
//     const [familyDetails, setFamilyDetails] = useState<FamilyDetails>();

//     const [contactDetails, setContactDetails] = useState<Contact[]>([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchUserDetails = async () => {
//             setLoading(true);
//             try {
//                 const userResponse = await axios.get<Male | Women>(`https://localhost:7012/api/${role}/${id}`);
//                 console.log("detailsForUser:" + userResponse.data);
                
//                 if (role === 'Male') {
//                     setmale(userResponse.data);
//                 } else {
//                     setWomen(userResponse.data);
//                 }

//                 // קריאה לקבלת פרטי משפחה
//                 const familyResponse = await axios.get<FamilyDetails[]>(`https://localhost:7012/api/FamilyDetails`);
//                 const x = familyResponse.data.filter((item) => {
//                     return item.maleId === Number(id) || item.womenId === Number(id);
//                 });

//                 setFamilyDetails(x[0]);
//                 // console.log("fff " + x[0]); // הדפס את ה-familyDetails לאחר העדכון

//                 // קריאה לקבלת פרטי התקשרות
//                 const contactResponse = await axios.get(`https://localhost:7012/api/Contact`);
//                 const contacts = contactResponse.data.filter((item:any) => {
//                     return item.maleId === Number(id) || item.womenId === Number(id);
//                 });
//                 setContactDetails(contacts);

//             } catch (error) {
//                 console.error("Error fetching user details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserDetails();
//     }, [role, id]);
//     return (
//         <div>
//             {Male && <Card sx={{ margin: 2}}>
//                 <CardContent>
//                     <Typography variant="h4" gutterBottom>{Male?.firstName} {Male?.lastName}</Typography>
//                     <Typography variant="h5">פרטים אישיים</Typography>
//                     <Typography variant="body1">מס זהות: {Male?.tz}</Typography>
//                     <Typography variant="body1">תאריך לידה: {Male?.burnDate}</Typography>
//                     <Typography variant="body1">כתובת: {Male?.address}</Typography>
//                     <Typography variant="body1">גיל: {Male?.age}</Typography>
//                     <Typography variant="body1">עיר: {Male?.city}</Typography>
//                     <Typography variant="body1">מדינה: {Male?.country}</Typography>
//                     <Typography variant="body1">חוג: {Male?.class}</Typography>
//                     {Male?.anOutsider && <Typography variant="body1"> {Male?.anOutsider}</Typography>}
//                     <Typography variant="body1">רקע: {Male?.backGround}</Typography>
//                     <Typography variant="body1">פתיחות: {Male?.openness}</Typography>

//                     <Typography variant="h5">פרטים נוספים</Typography>
//                     <Typography variant="body1">מצב בריאותי: {Male?.healthCondition ? 'כן' : 'לא'}</Typography>
//                     <Typography variant="body1">סטטוס: {Male?.status}</Typography>

//                     {Male?.driversLicense && <Typography variant="body1"> רשיון נהיגה</Typography>}
//                     {Male?.smoker && <Typography variant="body1">מעשן</Typography>}
//                     <Typography variant="body1">זקן: {Male?.beard}</Typography>
//                     <Typography variant="body1">כובע: {Male?.hot}</Typography>
//                     <Typography variant="body1">חליפה: {Male?.suit}</Typography>

//                     <Typography variant="h5">רקע ישיבתי</Typography>
//                     <Typography variant="body1">ישיבה קטנה: {Male?.smallYeshiva}</Typography>
//                     <Typography variant="body1">ישיבה גדולה: {Male?.bigYeshiva}</Typography>
//                     <Typography variant="body1">קיבוץ: {Male?.kibbutz}</Typography>
//                     <Typography variant="body1">עיסוק: {Male?.occupation}</Typography>

//                     <Typography variant="h5">מראה חיצוני</Typography>
//                     <Typography variant="body1">גובה: {Male?.height} ס"מ</Typography>
//                     <Typography variant="body1">מראה כללי: {Male?.generalAppearance}</Typography>
//                     <Typography variant="body1">צבע פנים: {Male?.facePaint}</Typography>
//                     <Typography variant="body1">מראה: {Male?.appearance}</Typography>
//                     <Typography variant="h5">ציפיות מבת הזוג </Typography>

//                     <Typography variant="body1">ציפיות מהשותף: {Male?.expectationsFromPartner}</Typography>
//                     <Typography variant="body1">חוג: {Male?.club}</Typography>
//                     <Typography variant="body1">גיל מינימלי: {Male?.ageFrom}</Typography>
//                     <Typography variant="body1">גיל מקסימלי: {Male?.ageTo}</Typography>
//                     <Typography variant="body1">תכונות חשובות בי: {Male?.importantTraitsInMe}</Typography>
//                     <Typography variant="body1">תכונות חשובות שאני מחפש: {Male?.importantTraitsIAmLookingFor}</Typography>
//                     <Typography variant="body1">סגנון סמינר מועדף: {Male?.preferredSeminarStyle}</Typography>
//                     <Typography variant="body1">מסלול מקצועי מועדף: {Male?.preferredProfessionalPath}</Typography>
//                     <Typography variant="body1">כיסוי ראש: {Male?.headCovering}</Typography>
//                 </CardContent>
//             </Card>}

//             {Women&&<Card sx={{ margin: 2 }}>
//                 <CardContent>
//                     <Typography variant="h4" gutterBottom>{Women.firstName} {Women.lastName}</Typography>
//                     <Typography variant="h5">פרטים אישיים</Typography>
//                     <Typography variant="body1">מס זהות: {Women.tz}</Typography>
//                     <Typography variant="body1">תאריך לידה: {Women.burnDate}</Typography>
//                     <Typography variant="body1">כתובת: {Women.address}</Typography>
//                     <Typography variant="body1">גיל: {Women.age}</Typography>
//                     <Typography variant="body1">עיר: {Women.city}</Typography>
//                     <Typography variant="body1">מדינה: {Women.country}</Typography>
//                     <Typography variant="body1">חוג: {Women.class}</Typography>
//                     {Women.anOutsider && <Typography variant="body1"> {Women.anOutsider}</Typography>}
//                     <Typography variant="body1">רקע: {Women.backGround}</Typography>
//                     <Typography variant="body1">פתיחות: {Women.openness}</Typography>

//                     <Typography variant="h5">פרטים נוספים</Typography>
//                     <Typography variant="body1">מצב בריאותי: {Women.healthCondition ? 'כן' : 'לא'}</Typography>
//                     <Typography variant="body1">סטטוס: {Women.status}</Typography>
//                     <Typography variant="body1">כיסוי ראש: {Women.headCovering}</Typography>

//                     <Typography variant="h5">רקע השכלתי </Typography>
//                     <Typography variant="body1">תיכון: {Women.highSchool}</Typography>
//                     <Typography variant="body1">סמינר: {Women.seminar}</Typography>
//                     <Typography variant="body1">מסלול לימודי :{Women.studyPath}</Typography>
//                     <Typography variant="body1">מוסד לימודי נוסף: {Women.additionalEducationalInstitution}</Typography>
//                     <Typography variant="body1">עיסוק כיום: {Women.currentOccupation}</Typography>


//                     <Typography variant="h5">מראה חיצוני</Typography>
//                     <Typography variant="body1">גובה: {Women.height} ס"מ</Typography>
//                     <Typography variant="body1">מראה כללי: {Women.generalAppearance}</Typography>
//                     <Typography variant="body1">צבע פנים: {Women.facePaint}</Typography>
//                     <Typography variant="body1">מראה: {Women.appearance}</Typography>

                 
//                     <Typography variant="h5">ציפיות מבן הזוג </Typography>

//                     <Typography variant="body1">חוג: {Women.club}</Typography>
//                     <Typography variant="body1">גיל מינימלי: {Women.ageFrom}</Typography>
//                     <Typography variant="body1">גיל מקסימלי: {Women.ageTo}</Typography>
//                     <Typography variant="body1">תכונות חשובות בי: {Women.importantTraitsInMe}</Typography>
//                     <Typography variant="body1">תכונות חשובות שאני מחפש: {Women.importantTraitsIMLookingFor}</Typography>
//                     <Typography variant="body1"> סגנון הישיבות המועדף: {Women.preferredSittingStyle}</Typography>
//                     <Typography variant="h6">  מעונינת שהבחור יהיה </Typography>

//                     {Women.drivingLicense && <Typography variant="body1"> רשיון נהיגה</Typography>}
//                     {Women.smoker && <Typography variant="body1">לא מעשן</Typography>}
//                     <Typography variant="body1">זקן: {Women.beard}</Typography>
//                     <Typography variant="body1">כובע: {Women.hat}</Typography>
//                     <Typography variant="body1">חליפה: {Women.suit}</Typography>
//                     <Typography variant="body1">עיסוק: {Women.occupation}</Typography>



//                     {/* הוסף כאן שדות נוספים לפי הצורך */}
//                 </CardContent>
//             </Card>}
//             <Typography variant="h5">פרטי משפחה</Typography>
//             {familyDetails &&<Card sx={{ margin: 2 }}>
//             <CardContent>
//                 <div>
//                     {/* הצג את פרטי המשפחה */}
//                     <Typography variant="h6">פרטי האב:</Typography>
//                     <Typography variant="body1">שם : {familyDetails.fatherName}</Typography>
//                     <Typography variant="body1">מוצא : {familyDetails.fatherOrigin}</Typography>
//                     <Typography variant="body1">יוצא ישיבת: {familyDetails.fatherYeshiva}</Typography>
//                     <Typography variant="body1"> השתייכות: {familyDetails.fatherAffiliation}</Typography>
//                     <Typography variant="body1"> עיסוק: {familyDetails.fatherOccupation}</Typography>

//                     {/* הוסף שדות נוספים לפי הצורך */}
//                 </div>
//                 </CardContent>
//                 </Card>}
//                 {!familyDetails&&<div>לא נמצאו פרטים</div>}

//             <Typography variant="h5">פרטי התקשרות</Typography>
//             {contactDetails ? (
//                 <Card sx={{ margin: 2 }}>
//             <CardContent>
                
//                     {/* הצג את פרטי ההתקשרות */}
//                      {contactDetails.map(contact => ( 
//                          <div key={contact.id}> 
//                             <Typography variant="body1">שם איש קשר: {contact.name}</Typography> 
//                             <Typography variant="body1">טלפון: {contact.phone}</Typography> 
//                             <br />
//                         </div>
                        
//                      ))}
//                    </CardContent>
//                    </Card>
//             ) : (
//                 <Typography variant="body1">לא נמצאו פרטי התקשרות.</Typography>
//             )} 
//         </div>
//     );
// };

// export default Details;
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CircularProgress, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Contact, FamilyDetails, Male, Women } from '../Models';

const Details = () => {
    const { role, id } = useParams();
    const [Women, setWomen] = useState<Women>();
    const [Male, setmale] = useState<Male>();
    const [familyDetails, setFamilyDetails] = useState<FamilyDetails>();
    const [contactDetails, setContactDetails] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const userResponse = await axios.get<Male | Women>(`https://localhost:7012/api/${role}/${id}`);
                console.log("detailsForUser:" + userResponse.data);
                
                if (role === 'Male') {
                    setmale(userResponse.data);
                } else {
                    setWomen(userResponse.data);
                }

                // קריאה לקבלת פרטי משפחה
                const familyResponse = await axios.get<FamilyDetails[]>(`https://localhost:7012/api/FamilyDetails`);
                const x = familyResponse.data.filter((item) => {
                    return item.maleId === Number(id) || item.womenId === Number(id);
                });

                setFamilyDetails(x[0]);

                // קריאה לקבלת פרטי התקשרות
                const contactResponse = await axios.get(`https://localhost:7012/api/Contact`);
                const contacts = contactResponse.data.filter((item:any) => {
                    return item.maleId === Number(id) || item.womenId === Number(id);
                });
                setContactDetails(contacts);

            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [role, id]);

    if (loading) return <CircularProgress />;

    return (
        <div>
            {Male && (
                <Card sx={{ margin: 2 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>{Male?.firstName} {Male?.lastName}</Typography>
                        <Typography variant="h5">פרטים אישיים</Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">מס זהות</TableCell>
                                    <TableCell align="left">{Male?.tz}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">תאריך לידה</TableCell>
                                    <TableCell align="left">{Male?.burnDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">כתובת</TableCell>
                                    <TableCell align="left">{Male?.address}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">גיל</TableCell>
                                    <TableCell align="left">{Male?.age}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">עיר</TableCell>
                                    <TableCell align="left">{Male?.city}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">מדינה</TableCell>
                                    <TableCell align="left">{Male?.country}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">חוג</TableCell>
                                    <TableCell align="left">{Male?.class}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">רקע</TableCell>
                                    <TableCell align="left">{Male?.backGround}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">תעסוקה</TableCell>
                                    <TableCell align="left">{Male?.occupation}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">מצב משפחתי</TableCell>
                                    <TableCell align="left">{Male?.maritalStatus}</TableCell>
                                </TableRow>
                                {/* הוסף שדות נוספים לפי הצורך */}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {Women && (
                <Card sx={{ margin: 2 }} >
                    <CardContent>
                        <Typography variant="h4" gutterBottom>{Women.firstName} {Women.lastName}</Typography>
                        <Typography variant="h5">פרטים אישיים</Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">מס זהות</TableCell>
                                    <TableCell align="left">{Women.tz}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">תאריך לידה</TableCell>
                                    <TableCell align="left">{Women.burnDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">כתובת</TableCell>
                                    <TableCell align="left">{Women.address}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">גיל</TableCell>
                                    <TableCell align="left">{Women.age}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">עיר</TableCell>
                                    <TableCell align="left">{Women.city}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">מדינה</TableCell>
                                    <TableCell align="left">{Women.country}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">חוג</TableCell>
                                    <TableCell align="left">{Women.class}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">רקע</TableCell>
                                    <TableCell align="left">{Women.backGround}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">תעסוקה</TableCell>
                                    <TableCell align="left">{Women.occupation}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">מצב משפחתי</TableCell>
                                    <TableCell align="left">{Women.maritalStatus}</TableCell>
                                </TableRow>
                                {/* הוסף שדות נוספים לפי הצורך */}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Typography variant="h5">פרטי משפחה</Typography>
            {familyDetails && (
                <Card sx={{ margin: 2 }}>
                    <CardContent>
                        <Typography variant="h6">פרטי האב:</Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">שם</TableCell>
                                    <TableCell align="left">{familyDetails.fatherName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">מוצא</TableCell>
                                    <TableCell align="left">{familyDetails.fatherOrigin}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">יוצא ישיבת</TableCell>
                                    <TableCell align="left">{familyDetails.fatherYeshiva}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">השתייכות</TableCell>
                                    <TableCell align="left">{familyDetails.fatherAffiliation}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">עיסוק</TableCell>
                                    <TableCell align="left">{familyDetails.fatherOccupation}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
            {!familyDetails && <div>לא נמצאו פרטים</div>}

            <Typography variant="h5">פרטי התקשרות</Typography>
            {contactDetails.length > 0 ? (
                <Card sx={{ margin: 2 }} >
                    <CardContent>
                        <Table>
                            <TableBody>
                                {contactDetails.map(contact => (
                                    <><TableRow key={contact.id}>
                                        <TableCell align="right">שם איש קשר</TableCell>
                                        <TableCell align="left">{contact.name}</TableCell>
                                    </TableRow><TableRow>
                                            <TableCell align="right">טלפון</TableCell>
                                            <TableCell align="left">{contact.phone}</TableCell>
                                        </TableRow></>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1">לא נמצאו פרטי התקשרות.</Typography>
            )}
        </div>
    );
};

export default Details;
