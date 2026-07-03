import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#090c0d",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(61,220,132,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(61,220,132,0.06) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* glow orb */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(61,220,132,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(86,232,212,0.08) 0%, transparent 70%)",
          }}
        />

        {/* top bar — IDE tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0px",
            marginBottom: "48px",
          }}
        >
          {["about.tsx", "skills.json", "projects/"].map((tab, i) => (
            <div
              key={tab}
              style={{
                padding: "8px 20px",
                background: i === 0 ? "#090c0d" : "#0e1414",
                borderTop: i === 0 ? "2px solid #3ddc84" : "2px solid transparent",
                borderRight: "1px solid #1c2826",
                color: i === 0 ? "#3ddc84" : "#3a4544",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: i === 0 ? "#3ddc84" : "#3a4544",
                }}
              />
              {tab}
            </div>
          ))}
        </div>

        {/* main content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {/* code comment */}
          <div
            style={{
              color: "#3a4544",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            {"/** Full Stack Developer & AWS Certified Cloud Practitioner */"}
          </div>

          {/* const line */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#3ddc84", fontSize: "22px" }}>const</span>
            <span style={{ color: "#e8c252", fontSize: "22px" }}>developer</span>
            <span style={{ color: "#d4dadb", fontSize: "22px" }}>=</span>
            <span style={{ color: "#d4dadb", fontSize: "22px" }}>{"{"}</span>
          </div>

          {/* name */}
          <div
            style={{
              paddingLeft: "40px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "#d4dadb",
                lineHeight: 1.1,
                display: "flex",
                alignItems: "baseline",
                gap: "0px",
              }}
            >
              <span style={{ color: "#d4dadb" }}>Manish </span>
              <span style={{ color: "#3ddc84" }}>Kushwaha</span>
              <span
                style={{
                  color: "#56e8d4",
                  marginLeft: "4px",
                }}
              >
                _
              </span>
            </div>
          </div>

          {/* role */}
          <div style={{ paddingLeft: "40px", marginBottom: "8px", display: "flex", gap: "12px" }}>
            <span style={{ color: "#e8c252", fontSize: "20px" }}>role</span>
            <span style={{ color: "#d4dadb", fontSize: "20px" }}>:</span>
            <span style={{ color: "#56e8d4", fontSize: "20px" }}>
              &quot;Full Stack Developer&quot;
            </span>
            <span style={{ color: "#d4dadb", fontSize: "20px" }}>,</span>
          </div>

          {/* location */}
          <div style={{ paddingLeft: "40px", marginBottom: "8px", display: "flex", gap: "12px" }}>
            <span style={{ color: "#e8c252", fontSize: "20px" }}>location</span>
            <span style={{ color: "#d4dadb", fontSize: "20px" }}>:</span>
            <span style={{ color: "#56e8d4", fontSize: "20px" }}>
              &quot;Ranchi, Jharkhand, India&quot;
            </span>
            <span style={{ color: "#d4dadb", fontSize: "20px" }}>,</span>
          </div>

          {/* cert */}
          <div style={{ paddingLeft: "40px", marginBottom: "24px", display: "flex", gap: "12px" }}>
            <span style={{ color: "#e8c252", fontSize: "20px" }}>cert</span>
            <span style={{ color: "#d4dadb", fontSize: "20px" }}>:</span>
            <span style={{ color: "#56e8d4", fontSize: "20px" }}>
              &quot;AWS Certified Cloud Practitioner ✓&quot;
            </span>
          </div>

          <div style={{ paddingLeft: "0px", color: "#d4dadb", fontSize: "22px" }}>{"}"}</div>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid #1c2826",
          }}
        >
          {/* tech stack pills */}
          <div style={{ display: "flex", gap: "10px" }}>
            {["React", "Next.js", "Node.js", "AWS", "Python"].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "6px 16px",
                  border: "1px solid #1c2826",
                  color: "#5c6b6b",
                  fontSize: "14px",
                  background: "#0e1414",
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          {/* status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#3ddc84",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#3ddc84",
              }}
            />
            available for work
          </div>
        </div>

        {/* status bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "28px",
            background: "#3ddc84",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
        >
          <span style={{ color: "#090c0d", fontSize: "12px", fontWeight: "bold" }}>
            ⎇ main · build passing
          </span>
          <span style={{ color: "#090c0d", fontSize: "12px", fontWeight: "bold" }}>
            UTF-8 · Next.js · Ranchi, IN
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}