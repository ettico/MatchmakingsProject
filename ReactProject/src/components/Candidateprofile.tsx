"use client"
import { useState, useEffect, useContext } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { userContext } from "./UserContext"

// אייקונים
import PersonIcon from "@mui/icons-material/Person"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CakeIcon from "@mui/icons-material/Cake"
import HeightIcon from "@mui/icons-material/Height"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import SchoolIcon from "@mui/icons-material/School"
import WorkIcon from "@mui/icons-material/Work"
import FavoriteIcon from "@mui/icons-material/Favorite"
import InfoIcon from "@mui/icons-material/Info"
import EditIcon from "@mui/icons-material/Edit"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import { Contact, FamilyDetails, Male, Women } from "../Models"

// אנימציות מותאמות אישית
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 115, 51, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(184, 115, 51, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 115, 51, 0);
  }
`

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(184, 115, 51, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(184, 115, 51, 0.6);
  }
`
const API_BASE_URL = "https://matchmakingsprojectserver.onrender.com/api"

const NA = "לא צוין"

function val(v: any): string {
  if (v === null || v === undefined || v === "") return NA
  if (typeof v === "boolean") return v ? "כן" : "לא"
  return String(v)
}

function isMissing(v: any) {
  return v === null || v === undefined || v === ""
}

// ─── Small display components ─────────────────────────────────────────────────
function FieldRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: any
}) {
  const missing = isMissing(value)
  const display = val(value)
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/60 transition-colors mb-2 group">
      <span className="text-[#b87333] mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        <p className={`text-sm font-semibold ${missing ? "text-gray-400 italic" : "text-[#2c1810]"}`}>
          {display}
        </p>
      </div>
    </div>
  )
}

function BoolBadge({ label, value }: { label: string; value: any }) {
  const missing = isMissing(value)
  const isTrue = value === true || value === "true" || value === 1
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${
        missing
          ? "bg-gray-100 text-gray-400 border-gray-200"
          : isTrue
          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      {missing ? "—" : isTrue ? "✓" : "✗"} {label}
    </span>
  )
}

function SectionCard({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="relative rounded-3xl bg-white border border-amber-100 shadow-[0_8px_32px_rgba(184,115,51,0.1)] mb-6 overflow-hidden">
      {/* top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b87333] via-[#d4af37] to-[#b87333]" />
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-6 pt-6 pb-4 text-left hover:opacity-90 transition-opacity"
      >
        <span className="text-[#b87333]">{icon}</span>
        <span
          className="flex-1 text-xl font-extrabold"
          style={{
            background: "linear-gradient(135deg,#2c1810 0%,#b87333 50%,#d4af37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </span>
        <span className="text-[#b87333]">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          )}
        </span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-1">{children}</div>
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = {
  person: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
  email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>,
  phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  location: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  school: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  work: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  heart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  family: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  contact: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  id: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 10h2M16 14h2M8 10h.01M8 14h.01M12 10h.01M12 14h.01"/></svg>,
  cake: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v2M12 8v2M17 8v2M7 4l.57-1.43A1 1 0 018.5 2h7a1 1 0 01.93.63L17 4"/></svg>,
  height: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h4M18 12h4M2 6h2M20 6h2M2 18h2M20 18h2"/></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  book: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface UserProfileProps {
  candidateData?: any
  onClose?: () => void
}

const UserProfile = ({ candidateData, onClose }: UserProfileProps) => {
  const [userData, setUserData] = useState<(Male | Women) | null>(null)
  const [familyData, setFamilyData] = useState<FamilyDetails | null>(null)
  const [contactsData, setContactsData] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  // Replace userContext import with your actual context. Stub used here.
  const ctx = useContext(userContext) as any
  const user: any = ctx?.user ?? null
  const token: string | null = ctx?.token ?? null

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError("")

        const apiFetch = async (url: string, tkn: string) => {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${tkn}`, "Content-Type": "application/json" },
          })
          if (!res.ok) throw Object.assign(new Error(res.statusText), { response: { status: res.status } })
          return res.json()
        }

        if (candidateData) {
          setUserData(candidateData)
          if (token) {
            try {
              const data = await apiFetch(`${API_BASE_URL}/FamilyDetails`, token)
              const found = data.find(
                (d: any) =>
                  (candidateData.role === "Male" && d.maleId === candidateData.id) ||
                  (candidateData.role === "Women" && d.womenId === candidateData.id),
              )
              if (found) setFamilyData(found)
            } catch {}
            try {
              const data = await apiFetch(`${API_BASE_URL}/Contact`, token)
              setContactsData(
                data.filter(
                  (c: any) =>
                    (candidateData.role === "Male" && c.maleId === candidateData.id) ||
                    (candidateData.role === "Women" && c.womenId === candidateData.id),
                ),
              )
            } catch {}
          }
          return
        }

        if (!user || !token) {
          setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
          return
        }

        const { id, role } = user
        const apiUrl = role === "Male" ? `${API_BASE_URL}/Male/${id}` : `${API_BASE_URL}/Women/${id}`

        const uData = await apiFetch(apiUrl, token)
        setUserData(uData)

        try {
          const fAll = await apiFetch(`${API_BASE_URL}/FamilyDetails`, token)
          const fFound = fAll.find(
            (d: any) => (role === "Male" && d.maleId === id) || (role === "Women" && d.womenId === id),
          )
          if (fFound) setFamilyData(fFound)
        } catch {}

        try {
          const cAll = await apiFetch(`${API_BASE_URL}/Contact`, token)
          setContactsData(
            cAll.filter(
              (c: any) => (role === "Male" && c.maleId === id) || (role === "Women" && c.womenId === id),
            ),
          )
        } catch {}
      } catch (err: any) {
        if (err.response?.status === 401) setError("אין הרשאה. אנא התחבר מחדש.")
        else if (err.response?.status === 404) setError("הפרופיל לא נמצא.")
        else if (err.response?.status === 500) setError("שגיאת שרת. נסה מאוחר יותר.")
        else if (err.request) setError("לא ניתן להתחבר לשרת.")
        else setError("שגיאה טכנית בטעינת הפרופיל.")
      } finally {
        setLoading(false)
      }
    }

    const t = setTimeout(loadProfile, 100)
    return () => clearTimeout(t)
  }, [user, token, candidateData])

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(135deg,#f8f9fa 0%,#fff8f0 50%,#f0f8ff 100%)" }}>
        <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-[#b87333] animate-spin" />
        <p className="text-xl font-semibold text-[#2c1810]">טוען פרופיל...</p>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !userData) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#f8f9fa 0%,#fff8f0 50%,#f0f8ff 100%)" }}>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg w-full text-center">
          <p className="text-2xl font-bold text-red-700 mb-2">שגיאה בטעינת הפרופיל</p>
          <p className="text-red-600">{error || "לא נמצאו נתוני משתמש"}</p>
          <p className="text-red-400 text-sm mt-3">נסה לרענן את הדף או להתחבר מחדש</p>
        </div>
      </div>
    )
  }

  const isMale = (userData as any).role === "Male"
  const u = userData as any

  return (
    <div
      dir="rtl"
      className="min-h-screen py-8 px-4"
      style={{ background: "linear-gradient(135deg,#f8f9fa 0%,#fff8f0 50%,#f0f8ff 100%)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Header Card ─────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6">
          <div
            className="relative px-8 py-10"
            style={{ background: "linear-gradient(135deg,#2c1810 0%,#b87333 55%,#d4af37 100%)" }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="shrink-0">
                {u.photoUrl ? (
                  <img
                    src={u.photoUrl}
                    alt={`${u.firstName} ${u.lastName}`}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white/80 shadow-xl"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-white/20 border-4 border-white/80 shadow-xl flex items-center justify-center">
                    <span className="text-white" style={{ transform: "scale(3)" }}>{Icon.person}</span>
                  </div>
                )}
              </div>

              {/* Name & chips */}
              <div className="flex-1 text-center sm:text-right">
                <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-3">
                  {u.firstName} {u.lastName}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
                    {Icon.cake} גיל {val(u.age)}
                  </span>
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
                    {Icon.location} {val(u.city)}{u.city && u.country ? ", " : ""}{val(u.country)}
                  </span>
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
                    {Icon.height} {val(u.height)} ס"מ
                  </span>
                </div>
                <p className="text-white/90 font-medium text-lg">
                  {val(u.status)} • {val(u.backGround)} • {val(u.openness)}
                </p>
              </div>

              {/* Close / Edit button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Personal Details ─────────────────────────────────────────────────── */}
        <SectionCard title="פרטים אישיים" icon={Icon.person} defaultOpen>
          <Grid2>
            <FieldRow icon={Icon.email} label="אימייל" value={u.email} />
            <FieldRow icon={Icon.phone} label="טלפון" value={u.phone} />
            <FieldRow icon={Icon.id} label="תעודת זהות" value={u.tz} />
            <FieldRow icon={Icon.calendar} label="תאריך שריפה" value={u.burnDate} />
          </Grid2>
          <FieldRow icon={Icon.location} label="כתובת מלאה" value={[u.address, u.city, u.country].filter(Boolean).join(", ") || null} />
          <Grid2>
            <FieldRow icon={Icon.info} label="עדה" value={u.class} />
            <FieldRow icon={Icon.info} label="רקע" value={u.backGround} />
            <FieldRow icon={Icon.info} label="פתיחות" value={u.openness} />
            <FieldRow icon={Icon.info} label="סטטוס" value={u.status} />
            <FieldRow icon={Icon.info} label="סוג שידוך" value={u.pairingType} />
            <FieldRow icon={Icon.height} label='גובה (ס"מ)' value={u.height} />
            <FieldRow icon={Icon.info} label="מראה כללי" value={u.generalAppearance} />
            <FieldRow icon={Icon.info} label="מראה" value={u.appearance} />
            <FieldRow icon={Icon.info} label="איפור פנים" value={u.facePaint} />
            <FieldRow icon={Icon.info} label="כיסוי ראש" value={u.headCovering} />
            <FieldRow icon={Icon.info} label="לבוש חליפה" value={u.suit} />
            <FieldRow icon={Icon.info} label="זקן" value={u.beard} />
          </Grid2>

          {/* boolean badges */}
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            <BoolBadge label="בריאות תקינה" value={u.healthCondition} />
            <BoolBadge label="פנוי לשידוך" value={u.statusVacant} />
            <BoolBadge label="מחוץ לעיר" value={u.anOutsider} />
            <BoolBadge label="מעשן" value={u.smoker} />
            {isMale
              ? <BoolBadge label="רישיון נהיגה" value={u.driversLicense} />
              : <BoolBadge label="רישיון נהיגה" value={u.drivingLicense} />
            }
          </div>

          {/* Male-only personal */}
          {isMale && (
            <Grid2>
              <FieldRow icon={Icon.star} label="חם" value={u.hot} />
            </Grid2>
          )}

          {/* More information */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 font-medium mb-1">מידע נוסף</p>
            {u.moreInformation ? (
              <p className="text-sm text-[#2c1810] italic p-3 bg-amber-50 rounded-xl border-r-4 border-[#b87333] leading-relaxed">
                {u.moreInformation}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic p-3 bg-gray-50 rounded-xl border-r-4 border-gray-200">{NA}</p>
            )}
          </div>
        </SectionCard>

        {/* ── Education & Career ───────────────────────────────────────────────── */}
        <SectionCard title="השכלה ותעסוקה" icon={Icon.school} defaultOpen={false}>
          {isMale ? (
            <Grid2>
              <FieldRow icon={Icon.school} label="ישיבה קטנה" value={u.smallYeshiva} />
              <FieldRow icon={Icon.school} label="ישיבה גדולה" value={u.bigYeshiva} />
              <FieldRow icon={Icon.work} label="קיבוץ / מקום שהות" value={u.kibbutz} />
              <FieldRow icon={Icon.work} label="עיסוק" value={u.occupation} />
              <FieldRow icon={Icon.book} label="סגנון ישיבה מועדף" value={u.preferredSeminarStyle} />
              <FieldRow icon={Icon.book} label="מסלול מקצועי מועדף" value={u.preferredProfessionalPath} />
            </Grid2>
          ) : (
            <Grid2>
              <FieldRow icon={Icon.school} label="תיכון" value={u.highSchool} />
              <FieldRow icon={Icon.school} label="סמינר" value={u.seminar} />
              <FieldRow icon={Icon.book} label="מסלול לימוד" value={u.studyPath} />
              <FieldRow icon={Icon.school} label="מוסד חינוכי נוסף" value={u.additionalEducationalInstitution} />
              <FieldRow icon={Icon.work} label="עיסוק נוכחי" value={u.currentOccupation} />
              <FieldRow icon={Icon.work} label="עיסוק" value={u.occupation} />
              <FieldRow icon={Icon.book} label="סגנון ישיבה מועדף" value={u.preferredSittingStyle} />
              <FieldRow icon={Icon.info} label="כיסוי ראש לבחור" value={u.hat} />
            </Grid2>
          )}
        </SectionCard>

        {/* ── Pairing Preferences ─────────────────────────────────────────────── */}
        <SectionCard title="העדפות ומאפיינים לשידוך" icon={Icon.heart} defaultOpen={false}>
          <Grid2>
            <FieldRow icon={Icon.info} label="גיל מינימלי לשידוך" value={u.ageFrom} />
            <FieldRow icon={Icon.info} label="גיל מקסימלי לשידוך" value={u.ageTo} />
            <FieldRow icon={Icon.info} label="מועדון / חוג" value={u.club} />
            {isMale
              ? <FieldRow icon={Icon.info} label="ציפיות מבן/בת זוג" value={u.expectationsFromPartner} />
              : <FieldRow icon={Icon.info} label="מעוניינת בבחור" value={u.interestedInBoy} />
            }
          </Grid2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">תכונות חשובות בי</p>
              {u.importantTraitsInMe ? (
                <p className="text-sm text-[#2c1810] p-3 bg-amber-50 rounded-xl border-r-4 border-[#b87333] leading-relaxed">
                  {u.importantTraitsInMe}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic p-3 bg-gray-50 rounded-xl border-r-4 border-gray-200">{NA}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">תכונות שאני מחפש/ת</p>
              {(u.importantTraitsIAmLookingFor || u.importantTraitsIMLookingFor) ? (
                <p className="text-sm text-[#2c1810] p-3 bg-yellow-50 rounded-xl border-r-4 border-[#d4af37] leading-relaxed">
                  {u.importantTraitsIAmLookingFor || u.importantTraitsIMLookingFor}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic p-3 bg-gray-50 rounded-xl border-r-4 border-gray-200">{NA}</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ── Family ──────────────────────────────────────────────────────────── */}
        <SectionCard title="פרטי משפחה" icon={Icon.family} defaultOpen={false}>
          {familyData ? (
            <>
              <Grid2>
                <FieldRow icon={Icon.person} label="שם האב" value={familyData.fatherName} />
                <FieldRow icon={Icon.info} label="מוצא האב" value={familyData.fatherOrigin} />
                <FieldRow icon={Icon.school} label="ישיבת האב" value={familyData.fatherYeshiva} />
                <FieldRow icon={Icon.info} label="השתייכות האב" value={familyData.fatherAffiliation} />
                <FieldRow icon={Icon.work} label="עיסוק האב" value={familyData.fatherOccupation} />
                <FieldRow icon={Icon.person} label="שם האם" value={familyData.motherName} />
                <FieldRow icon={Icon.info} label="מוצא האם" value={familyData.motherOrigin} />
                <FieldRow icon={Icon.school} label="סמינר האם" value={familyData.motherGraduateSeminar} />
                <FieldRow icon={Icon.info} label="שם קודם של האם" value={familyData.motherPreviousName} />
                <FieldRow icon={Icon.work} label="עיסוק האם" value={familyData.motherOccupation} />
                <FieldRow icon={Icon.person} label="רב המשפחה" value={familyData.familyRabbi} />
              </Grid2>
              <div className="flex gap-3 mt-2 mb-4">
                <BoolBadge label="הורים נשואים" value={familyData.parentsStatus} />
                <BoolBadge label="מצב בריאות תקין" value={familyData.healthStatus} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">על המשפחה</p>
                {familyData.familyAbout ? (
                  <p className="text-sm text-[#2c1810] italic p-3 bg-amber-50 rounded-xl border-r-4 border-[#b87333] leading-relaxed">
                    {familyData.familyAbout}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic p-3 bg-gray-50 rounded-xl border-r-4 border-gray-200">{NA}</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-400 italic text-sm py-4 text-center">לא נמצאו פרטי משפחה</p>
          )}
        </SectionCard>

        {/* ── Contacts for inquiry ────────────────────────────────────────────── */}
        <SectionCard title="אנשי קשר לבירורים" icon={Icon.contact} defaultOpen={false}>
          {contactsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactsData.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-sky-50 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#b87333,#d4af37)" }}>
                    <span className="text-white">{Icon.contact}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#2c1810]">{val((c as any).name)}</p>
                    {(c as any).contactType && (
                      <p className="text-sm text-gray-500">{(c as any).contactType}</p>
                    )}
                    <p className="font-semibold text-[#b87333] text-sm">{val(c.phone)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm py-4 text-center">לא נמצאו אנשי קשר</p>
          )}
        </SectionCard>

        {/* ── Additional contact phones ────────────────────────────────────────── */}
        <SectionCard title="פרטי קשר נוספים" icon={Icon.phone} defaultOpen>
          <Grid2>
            <FieldRow icon={Icon.phone} label="טלפון אב" value={u.fatherPhone} />
            <FieldRow icon={Icon.phone} label="טלפון אם" value={u.motherPhone} />
          </Grid2>
        </SectionCard>

      </div>
    </div>
  )
}

export default UserProfile
