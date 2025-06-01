import { Component,  OnInit,  AfterViewInit, ViewChild,  ElementRef,  NgZone } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CandidateService, Candidate } from "../../services/candidate/candidate.service"
import { HttpClientModule } from "@angular/common/http"
import { Chart, registerables } from "chart.js"

// Register all Chart.js components
Chart.register(...registerables)

@Component({
    selector: "app-analytics",
    standalone:true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: "./analytics.component.html",
    styleUrls: ["./analytics.component.css"]
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  candidates: Candidate[] = []
  isLoading = true
  error = ""
  activeTab = "all"
  chartsInitialized = false

  // Chart references
  ageChart: Chart | null = null
  sectorChart: Chart | null = null
  genderChart: Chart | null = null
  ratingChart: Chart | null = null

  // ViewChild references for canvas elements
  @ViewChild("ageChartCanvas") ageChartCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("sectorChartCanvas") sectorChartCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("genderChartCanvas") genderChartCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("ratingChartCanvas") ratingChartCanvas!: ElementRef<HTMLCanvasElement>

  constructor(
    private candidateService: CandidateService,
    private ngZone: NgZone,
  ) {
    console.log("Analytics component constructed")
  }

  ngOnInit(): void {
    console.log("Analytics component initialized")
    this.fetchCandidates()
  }

  ngAfterViewInit(): void {
    console.log("View initialized, checking if we can create charts")
    // If data is already loaded, create charts
    if (!this.isLoading && this.candidates.length > 0 && !this.chartsInitialized) {
      console.log("Data is loaded, creating charts")
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.createCharts()
        }, 500)
      })
    }
  }

  fetchCandidates(): void {
    console.log("Fetching candidates...")
    this.isLoading = true
    this.candidateService.getAllCandidates().subscribe({
      next: (data) => {
        console.log(`Received ${data.length} candidates`)
        this.candidates = data
        this.isLoading = false

        // Wait for view to be initialized before creating charts
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            console.log("Creating charts after data loaded")
            this.createCharts()
          }, 500)
        })
      },
      error: (error) => {
        console.error("Error fetching candidates:", error)
        this.error = "Failed to load candidate data"
        this.isLoading = false
      },
    })
  }

  // Helper methods for template
  getMaleCount(): number {
    return this.candidates.filter((c) => c.gender === "male").length
  }

  getFemaleCount(): number {
    return this.candidates.filter((c) => c.gender === "female").length
  }

  getUniqueSectorsCount(): number {
    return [...new Set(this.candidates.map((c) => c.sector))].length
  }

  setActiveTab(tab: string): void {
    console.log(`Setting active tab to ${tab}`)
    this.activeTab = tab

    // Destroy and recreate charts when tab changes to ensure proper rendering
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.destroyCharts()
        this.createCharts()
      }, 100)
    })
  }

  createCharts(): void {
    console.log("Creating charts function called")
    // Only create charts if data is loaded and we're not in loading state
    if (this.isLoading || this.candidates.length === 0) {
      console.log("Not creating charts - still loading or no data")
      return
    }

    // Destroy existing charts to prevent duplicates
    this.destroyCharts()

    // Create charts based on active tab
    if (this.activeTab === "all" || this.activeTab === "age") {
      this.createAgeChart()
    }

    if (this.activeTab === "all" || this.activeTab === "sector") {
      this.createSectorChart()
    }

    if (this.activeTab === "all" || this.activeTab === "gender") {
      this.createGenderChart()
    }

    if (this.activeTab === "all" || this.activeTab === "rating") {
      this.createRatingChart()
    }

    this.chartsInitialized = true
  }

  destroyCharts(): void {
    console.log("Destroying existing charts")
    if (this.ageChart) {
      this.ageChart.destroy()
      this.ageChart = null
    }

    if (this.sectorChart) {
      this.sectorChart.destroy()
      this.sectorChart = null
    }

    if (this.genderChart) {
      this.genderChart.destroy()
      this.genderChart = null
    }

    if (this.ratingChart) {
      this.ratingChart.destroy()
      this.ratingChart = null
    }
  }

  createAgeChart(): void {
    console.log("Creating age chart")
    if (!this.ageChartCanvas) {
      console.error("Age chart canvas not found")
      return
    }

    const canvas = this.ageChartCanvas.nativeElement
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Could not get 2D context for age chart")
      return
    }

    // Get age distribution from service
    const ageDistribution = this.candidateService.getAgeDistribution(this.candidates)
    console.log("Age distribution:", ageDistribution)

    this.ageChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ageDistribution.map((d) => d.ageRange),
        datasets: [
          {
            label: "Candidates by Age",
            data: ageDistribution.map((d) => d.count),
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
            ],
            borderColor: [
              "rgb(54, 162, 235)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(255, 99, 132)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Candidate Distribution by Age",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Candidates",
            },
          },
          x: {
            title: {
              display: true,
              text: "Age Range",
            },
          },
        },
      },
    })
  }

  createSectorChart(): void {
    console.log("Creating sector chart")
    if (!this.sectorChartCanvas) {
      console.error("Sector chart canvas not found")
      return
    }

    const canvas = this.sectorChartCanvas.nativeElement
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Could not get 2D context for sector chart")
      return
    }

    // Get sector distribution from service
    const sectorDistribution = this.candidateService.getSectorDistribution(this.candidates)
    console.log("Sector distribution:", sectorDistribution)

    this.sectorChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: sectorDistribution.map((d) => d.sector),
        datasets: [
          {
            data: sectorDistribution.map((d) => d.count),
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(255, 205, 86, 0.7)",
              "rgba(201, 203, 207, 0.7)",
              "rgba(0, 162, 235, 0.7)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Candidate Distribution by Sector",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    })
  }

  createGenderChart(): void {
    console.log("Creating gender chart")
    if (!this.genderChartCanvas) {
      console.error("Gender chart canvas not found")
      return
    }

    const canvas = this.genderChartCanvas.nativeElement
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Could not get 2D context for gender chart")
      return
    }

    // Get gender distribution from service
    const genderDistribution = this.candidateService.getGenderDistribution(this.candidates)
    console.log("Gender distribution:", genderDistribution)

    this.genderChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: genderDistribution.map((d) => d.gender),
        datasets: [
          {
            data: genderDistribution.map((d) => d.count),
            backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Candidate Distribution by Gender",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    })
  }

  createRatingChart(): void {
    console.log("Creating rating chart")
    if (!this.ratingChartCanvas) {
      console.error("Rating chart canvas not found")
      return
    }

    const canvas = this.ratingChartCanvas.nativeElement
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Could not get 2D context for rating chart")
      return
    }

    // Get rating distribution from service
    const ratingDistribution = this.candidateService.getRatingDistribution(this.candidates)
    console.log("Rating distribution:", ratingDistribution)

    this.ratingChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: Object.keys(ratingDistribution).map((rating) => `${rating} Star`),
        datasets: [
          {
            label: "Candidates by Rating",
            data: Object.values(ratingDistribution),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 2,
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Candidate Distribution by Rating",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
          },
        },
      },
    })
  }
}
