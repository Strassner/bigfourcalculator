import { useState } from 'react'
import {
  Box, Typography, TextField, MenuItem, Button, Divider, Paper,
} from '@mui/material'

const GREEN = '#1B3B2D'
const GREEN_HOVER = '#254d3a'
const GREEN_BORDER = 'rgba(27,59,45,0.7)'
const BG = '#0a0a0a'
const CARD = '#141414'
const CARD2 = '#1a1a1a'
const WHITE = '#ffffff'
const MUTED = 'rgba(255,255,255,0.45)'
const FAINT = 'rgba(255,255,255,0.07)'

const PLATEAU_OPTIONS = [
  { value: '1-2 weeks', label: '1–2 weeks' },
  { value: '2-4 weeks', label: '2–4 weeks' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3+ months', label: '3+ months' },
]

const SPEED_OPTIONS = [
  { value: 'slow', label: 'Slow — 0.5 lb / week' },
  { value: 'moderate', label: 'Moderate — 1 lb / week' },
  { value: 'fast', label: 'Fast — 1.5–2 lbs / week' },
]

const SPEED_DESC = {
  slow: 'Aiming for ~0.5 lb/week — sustainable and muscle-sparing.',
  moderate: 'Aiming for ~1 lb/week — the sweet spot for most people.',
  fast: "Aiming for 1.5–2 lbs/week — stay consistent and don't skip protein.",
}

const EMPTY = {
  heightFt: '', heightIn: '', weight: '', age: '',
  targetWeight: '', plateau: '', speed: '',
}

function calcResults({ weight, targetWeight }) {
  const w = Number(weight)
  const tw = Number(targetWeight)
  const steps = w > 300 ? 7500 : w > 250 ? 9000 : 10000
  const protein = w > 250 ? 200 : tw
  return { steps, protein }
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: WHITE,
    bgcolor: '#1c1c1c',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: GREEN },
  },
  '& .MuiInputLabel-root': { color: MUTED },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6bcfa0' },
  '& .MuiInputAdornment-root p': { color: MUTED },
  '& .MuiSelect-icon': { color: MUTED },
  '& .MuiFormHelperText-root': { color: '#f87171' },
}

export default function App() {
  const [form, setForm] = useState(EMPTY)
  const [results, setResults] = useState(null)
  const [errors, setErrors] = useState({})

  function set(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setErrors((er) => ({ ...er, [field]: '' }))
    }
  }

  function validate() {
    const e = {}
    const w = Number(form.weight)
    const tw = Number(form.targetWeight)
    const age = Number(form.age)
    const ft = Number(form.heightFt)
    const inches = Number(form.heightIn)

    if (!form.heightFt || ft < 1 || ft > 9) e.heightFt = 'Enter feet (1–9)'
    if (form.heightIn !== '' && (inches < 0 || inches > 11)) e.heightIn = '0–11'
    if (!form.weight || w < 50 || w > 800) e.weight = 'Enter weight (50–800)'
    if (!form.age || age < 10 || age > 100) e.age = 'Enter age (10–100)'
    if (!form.targetWeight || tw < 50 || tw > 800) e.targetWeight = 'Enter target (50–800)'
    else if (tw >= w) e.targetWeight = 'Must be less than current weight'
    if (!form.plateau) e.plateau = 'Select an option'
    if (!form.speed) e.speed = 'Select an option'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setResults(calcResults(form))
  }

  function handleReset() {
    setForm(EMPTY)
    setResults(null)
    setErrors({})
  }

  return (
    <Box
      sx={{
        minHeight: '100svh',
        bgcolor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
        py: 6,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 540 }}>
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: WHITE, letterSpacing: -0.5, mb: 0.75 }}
          >
            Fat Loss Calculator
          </Typography>
          <Typography variant="body2" sx={{ color: MUTED }}>
            Fill in your details and get your daily targets.
          </Typography>
        </Box>

        {!results ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Paper
              elevation={0}
              sx={{
                bgcolor: CARD,
                border: `1px solid ${FAINT}`,
                borderRadius: 3,
                p: { xs: 3, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              {/* Height */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 1.25 }}
                >
                  Height
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Feet"
                    type="number"
                    value={form.heightFt}
                    onChange={set('heightFt')}
                    error={!!errors.heightFt}
                    helperText={errors.heightFt}
                    slotProps={{ htmlInput: { min: 1, max: 9 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>ft</Typography> } }}
                    sx={{ flex: 1, ...fieldSx }}
                  />
                  <TextField
                    label="Inches"
                    type="number"
                    value={form.heightIn}
                    onChange={set('heightIn')}
                    error={!!errors.heightIn}
                    helperText={errors.heightIn}
                    slotProps={{ htmlInput: { min: 0, max: 11 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>in</Typography> } }}
                    sx={{ flex: 1, ...fieldSx }}
                  />
                </Box>
              </Box>

              {/* Weight */}
              <TextField
                label="Current Weight"
                type="number"
                value={form.weight}
                onChange={set('weight')}
                error={!!errors.weight}
                helperText={errors.weight}
                slotProps={{ htmlInput: { min: 50, max: 800 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>lbs</Typography> } }}
                fullWidth
                sx={fieldSx}
              />

              {/* Target Weight */}
              <TextField
                label="Target Bodyweight"
                type="number"
                value={form.targetWeight}
                onChange={set('targetWeight')}
                error={!!errors.targetWeight}
                helperText={errors.targetWeight}
                slotProps={{ htmlInput: { min: 50, max: 800 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>lbs</Typography> } }}
                fullWidth
                sx={fieldSx}
              />

              {/* Age */}
              <TextField
                label="Age"
                type="number"
                value={form.age}
                onChange={set('age')}
                error={!!errors.age}
                helperText={errors.age}
                slotProps={{ htmlInput: { min: 10, max: 100 }, input: { endAdornment: <Typography sx={{ color: MUTED, ml: 0.5 }}>yrs</Typography> } }}
                fullWidth
                sx={fieldSx}
              />

              {/* Plateau */}
              <TextField
                select
                label="How long have you been plateaued?"
                value={form.plateau}
                onChange={set('plateau')}
                error={!!errors.plateau}
                helperText={errors.plateau}
                fullWidth
                sx={fieldSx}
                slotProps={{
                  select: {
                    MenuProps: {
                      PaperProps: {
                        sx: { bgcolor: '#222', color: WHITE, border: `1px solid ${FAINT}` },
                      },
                    },
                  },
                }}
              >
                {PLATEAU_OPTIONS.map((o) => (
                  <MenuItem
                    key={o.value}
                    value={o.value}
                    sx={{ '&:hover': { bgcolor: GREEN }, '&.Mui-selected': { bgcolor: GREEN_HOVER } }}
                  >
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Speed */}
              <TextField
                select
                label="How fast do you want to lose weight?"
                value={form.speed}
                onChange={set('speed')}
                error={!!errors.speed}
                helperText={errors.speed}
                fullWidth
                sx={fieldSx}
                slotProps={{
                  select: {
                    MenuProps: {
                      PaperProps: {
                        sx: { bgcolor: '#222', color: WHITE, border: `1px solid ${FAINT}` },
                      },
                    },
                  },
                }}
              >
                {SPEED_OPTIONS.map((o) => (
                  <MenuItem
                    key={o.value}
                    value={o.value}
                    sx={{ '&:hover': { bgcolor: GREEN }, '&.Mui-selected': { bgcolor: GREEN_HOVER } }}
                  >
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 0.5,
                  bgcolor: GREEN,
                  color: WHITE,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: GREEN_HOVER },
                }}
              >
                Calculate My Plan
              </Button>
            </Paper>
          </Box>
        ) : (
          <Results results={results} form={form} onReset={handleReset} />
        )}
      </Box>
    </Box>
  )
}

function Results({ results, form, onReset }) {
  const w = Number(form.weight)

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: CARD,
        border: `1px solid ${FAINT}`,
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 0.5 }}
      >
        Your Daily Targets
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color: WHITE, mb: 0.75 }}>
        Here's your plan.
      </Typography>
      <Typography variant="body2" sx={{ color: MUTED, mb: 3.5 }}>
        {w} lbs current · {form.targetWeight} lbs target · plateaued {form.plateau}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <ResultCard
          emoji="👟"
          label="Daily Steps"
          value={results.steps.toLocaleString()}
          detail={
            w > 300
              ? "You're over 300 lbs — start here, build the habit"
              : w > 250
              ? "You're over 250 lbs — ramp up as this gets easy"
              : 'Non-negotiable minimum every single day'
          }
        />
        <ResultCard
          emoji="🥩"
          label="Daily Protein"
          value={`${results.protein}g`}
          detail={
            w > 250
              ? '200g cap — no need to go higher at your weight'
              : `1g per lb of your ${form.targetWeight} lb goal weight`
          }
        />
        <ResultCard
          emoji="😴"
          label="Sleep"
          value="7+ hrs"
          detail="Every night — non-negotiable for fat loss and recovery"
        />
        <ResultCard
          emoji="🏋️"
          label="Workouts"
          value="3× / week"
          detail="Full body 3×/week  —  or  Upper / Lower / Upper"
        />
      </Box>

      <Divider sx={{ borderColor: FAINT, mb: 3 }} />

      <Box
        sx={{
          bgcolor: GREEN,
          border: `1px solid ${GREEN_BORDER}`,
          borderRadius: 2,
          px: 2.5,
          py: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}
        >
          Speed Goal
        </Typography>
        <Typography variant="body1" sx={{ color: WHITE, fontWeight: 600 }}>
          {SPEED_DESC[form.speed]}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        onClick={onReset}
        sx={{
          borderColor: 'rgba(255,255,255,0.12)',
          color: MUTED,
          borderRadius: 2,
          py: 1.25,
          fontWeight: 600,
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.3)',
            bgcolor: 'rgba(255,255,255,0.04)',
            color: WHITE,
          },
        }}
      >
        Start Over
      </Button>
      <Button href="https://docs.google.com/document/d/1pmwyuSIfxG2MYrsHDgtuqDD8kEVOYLz7KFm1_p3j_m8/edit?usp=sharing" sx={{
          borderColor: 'rgba(255,255,255,0.12)',
          color: MUTED,
          borderRadius: 2,
          py: 1.25,
          fontWeight: 600,
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.3)',
            bgcolor: 'rgba(255,255,255,0.04)',
            color: WHITE,
          },
        }} variant="outlined" fullWidth sx={{ mt: 1 }}>
        Take the identity audit
      </Button>
    </Paper>
  )
}

function ResultCard({ emoji, label, value, detail }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: CARD2,
        border: `1px solid ${FAINT}`,
        borderRadius: 2,
        px: 2.5,
        py: 2,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 1.5,
          bgcolor: GREEN,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          flexShrink: 0,
        }}
      >
        {emoji}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block' }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: MUTED, mt: 0.25, lineHeight: 1.4 }}>
          {detail}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 800,
          color: WHITE,
          fontSize: { xs: '1.35rem', sm: '1.55rem' },
          lineHeight: 1,
          whiteSpace: 'nowrap',
          ml: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}
