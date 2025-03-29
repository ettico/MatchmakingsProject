import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CircularProgress, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
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
                }
                if (role === 'Women') {
                    setWomen(userResponse.data);
                    console.log(userResponse.data);

                }

                // קריאה לקבלת פרטי משפחה
                const familyResponse = await axios.get<FamilyDetails[]>(`https://localhost:7012/api/FamilyDetails`);
                const x = familyResponse.data.filter((item) => {
                    return item.maleId === Number(id) || item.womenId === Number(id);
                });

                setFamilyDetails(x[0]);

                // קריאה לקבלת פרטי התקשרות
                const contactResponse = await axios.get(`https://localhost:7012/api/Contact`);
                const contacts = contactResponse.data.filter((item: any) => {
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
                                    <TableCell align="right">{Male?.tz}</TableCell>
                                    <TableCell align="left">מס זהות</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.burnDate}</TableCell>
                                    <TableCell align="left">תאריך לידה</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.address}</TableCell>
                                    <TableCell align="left">כתובת</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.age}</TableCell>
                                    <TableCell align="left">גיל</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.city}</TableCell>
                                    <TableCell align="left">עיר</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.country}</TableCell>
                                    <TableCell align="left">מדינה</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.class}</TableCell>
                                    <TableCell align="left">חוג</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.anOutsider ? 'v' : 'x'}</TableCell>
                                    <TableCell align="left">חוצניק?</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.backGround}</TableCell>
                                    <TableCell align="left">רקע</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.openness}</TableCell>
                                    <TableCell align="left">פתיחות</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Typography variant="h5">פרטים נוספים</Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">{Male?.healthCondition ? 'v' : 'x'}</TableCell>
                                    <TableCell align="left">מצב בריאותי</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.status}</TableCell>
                                    <TableCell align="left"> סטטוס</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.driversLicense ? 'v' : 'x'}</TableCell>
                                    <TableCell align="left"> רשיון נהיגה</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.smoker}</TableCell>
                                    <TableCell align="left"> מעשן</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.beard}</TableCell>
                                    <TableCell align="left"> זקן</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.hot}</TableCell>
                                    <TableCell align="left"> כובע</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.suit}</TableCell>
                                    <TableCell align="left"> חליפה</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Typography variant="h5">רקע ישיבתי</Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">{Male?.smallYeshiva}</TableCell>
                                    <TableCell align="left"> ישיבה קטנה</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.bigYeshiva}</TableCell>
                                    <TableCell align="left"> ישיבה גדולה</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.kibbutz}</TableCell>
                                    <TableCell align="left"> קיבוץ</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.occupation}</TableCell>
                                    <TableCell align="left"> עיסוק</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                        <Typography variant="h5">מראה חיצוני</Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">{Male?.height} ס"מ</TableCell>
                                    <TableCell align="left"> גובה</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.generalAppearance}</TableCell>
                                    <TableCell align="left"> מראה כללי</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.facePaint}</TableCell>
                                    <TableCell align="left"> צבע פנים</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.appearance}</TableCell>
                                    <TableCell align="left"> מראה</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                        <Typography variant="h5">ציפיות מבת הזוג </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">{Male?.club}</TableCell>
                                    <TableCell align="left"> חוג</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.ageFrom}</TableCell>
                                    <TableCell align="left"> גיל מינימלי</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.ageTo}</TableCell>
                                    <TableCell align="left"> גיל מקסימלי</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.importantTraitsInMe}</TableCell>
                                    <TableCell align="left"> תכונות חשובות בי</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.importantTraitsIAmLookingFor}</TableCell>
                                    <TableCell align="left"> תכונות חשובות שאני מחפש</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.preferredSeminarStyle}</TableCell>
                                    <TableCell align="left"> סגנון סמינר מועדף</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.preferredProfessionalPath}</TableCell>
                                    <TableCell align="left"> מסלול מקצועי מועדף</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">{Male?.headCovering}</TableCell>
                                    <TableCell align="left"> כיסוי ראש</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {Women && (
                <Card sx={{ margin: 2 }} >
                    <CardContent>
                        <Typography variant="h4" gutterBottom>{Women?.firstName} {Women?.lastName}</Typography>
                        <Typography variant="h5">פרטים אישיים</Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="right">מס זהות</TableCell>
                                    <TableCell align="left">{Women?.tz}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">תאריך לידה</TableCell>
                                    <TableCell align="left">{Women?.burnDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">כתובת</TableCell>
                                    <TableCell align="left">{Women?.address}</TableCell>
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
                                    <TableCell align="right">חוצניקית?</TableCell>
                                    <TableCell align="left">{Women.class}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">רקע</TableCell>
                                    <TableCell align="left">{Women.backGround}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right">פתיחות</TableCell>
                                    <TableCell align="left">{Women.openness}</TableCell>
                                </TableRow>
                              
                            </TableBody>
                        </Table>



                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                                            <Typography variant="h5">פרטים נוספים</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>מצב בריאותי:</TableCell>
                                        <TableCell>{Women.healthCondition ? 'כן' : 'לא'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>סטטוס:</TableCell>
                                        <TableCell>{Women.status}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>כיסוי ראש:</TableCell>
                                        <TableCell>{Women.headCovering}</TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                                            <Typography variant="h5">רקע השכלתי </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>תיכון:</TableCell>
                                        <TableCell>{Women.highSchool}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>סמינר:</TableCell>
                                        <TableCell>{Women.seminar}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>מסלול לימודי:</TableCell>
                                        <TableCell>{Women.studyPath}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>מוסד לימודי נוסף:</TableCell>
                                        <TableCell>{Women.additionalEducationalInstitution}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>עיסוק כיום:</TableCell>
                                        <TableCell>{Women.currentOccupation}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                                            <Typography variant="h5">מראה חיצוני</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>גובה:</TableCell>
                                        <TableCell>{Women.height} ס"מ</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>מראה כללי:</TableCell>
                                        <TableCell>{Women.generalAppearance}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>צבע פנים:</TableCell>
                                        <TableCell>{Women.facePaint}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>מראה:</TableCell>
                                        <TableCell>{Women.appearance}</TableCell>
                                    </TableRow>
                                </TableBody>

                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                                            <Typography variant="h5">ציפיות מבן הזוג</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>חוג:</TableCell>
                                        <TableCell>{Women.club}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>גיל מינימלי:</TableCell>
                                        <TableCell>{Women.ageFrom}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>גיל מקסימלי:</TableCell>
                                        <TableCell>{Women.ageTo}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>תכונות חשובות בי:</TableCell>
                                        <TableCell>{Women.importantTraitsInMe}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>תכונות חשובות שאני מחפש:</TableCell>
                                        <TableCell>{Women.importantTraitsIMLookingFor}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>סגנון הישיבות המועדף:</TableCell>
                                        <TableCell>{Women.preferredSittingStyle}</TableCell>
                                    </TableRow>
                                </TableBody>

                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                                            <Typography variant="h6">מעונינת שהבחור יהיה</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Women.drivingLicense && (
                                        <TableRow>
                                            <TableCell>רשיון נהיגה</TableCell>
                                            <TableCell>v</TableCell>
                                        </TableRow>
                                    )}
                                    {Women.smoker && (
                                        <TableRow>
                                            <TableCell>לא מעשן</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell>זקן:</TableCell>
                                        <TableCell>{Women.beard}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>כובע:</TableCell>
                                        <TableCell>{Women.hat}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>חליפה:</TableCell>
                                        <TableCell>{Women.suit}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>עיסוק:</TableCell>
                                        <TableCell>{Women.occupation}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            <Typography variant="h5">פרטי משפחה</Typography>
            {familyDetails && (
                <Card sx={{ margin: 2 }}>
                    <CardContent>
                    <Typography variant="h6">פרטי האב:</Typography>
                    <Table>
    <TableHead>
        <TableRow>
            <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                <Typography variant="h5">פרטי האב</Typography>
            </TableCell>
        </TableRow>
    </TableHead>
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
    
    <TableHead>
        <TableRow>
            <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                <Typography variant="h5">פרטי האם</Typography>
            </TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        <TableRow>
            <TableCell align="right">שם האם</TableCell>
            <TableCell align="left">{familyDetails.motherName}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="right">מוצא האם</TableCell>
            <TableCell align="left">{familyDetails.motherOrigin}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="right">בוגרת סמינר</TableCell>
            <TableCell align="left">{familyDetails.motherGraduateSeminar}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="right">שם קודם</TableCell>
            <TableCell align="left">{familyDetails.motherPreviousName}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="right">עיסוק האם</TableCell>
            <TableCell align="left">{familyDetails.motherOccupation}</TableCell>
        </TableRow>
    </TableBody>

    <TableHead>
        <TableRow>
            <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                <Typography variant="h5">פרטים נוספים</Typography>
            </TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        <TableRow>
            <TableCell align="right">מצב הורים</TableCell>
            <TableCell align="left">{familyDetails.parentsStatus ? 'נוכחים' : 'לא נוכחים'}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="right">מצב בריאותי</TableCell>
            <TableCell align="left">{familyDetails.healthStatus ? 'תקין' : 'לא תקין'}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="right">רב משפחתי</TableCell>
            <TableCell align="left">{familyDetails.familyRabbi}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="right">מידע נוסף על המשפחה</TableCell>
            <TableCell align="left">{familyDetails.familyAbout}</TableCell>
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
