// app/page.js
"use client";
import { useEffect } from "react";
import "./home.css";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Hover effects
    document
      .querySelectorAll(".btn-primary, .btn-secondary, .cta-button")
      .forEach((button) => {
        button.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-2px) scale(1.02)";
        });
        button.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0) scale(1)";
        });
      });
  }, []);

  return (
    <>
      <nav>
        <div className="nav-container">
          <a href="" className="logo">
            <Image src="/logo.png" alt="DocuChat AI" width={100} height={100} />
          </a>
          <ul className="nav-links">
            {/* <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li> */}
          </ul>
          <a href="/login" className="cta-button">
            Get Started
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-content md:mt-0 mt-32">
            <h1>Chat with Your Documents Like Never Before</h1>
            <p>
              Transform any document into an intelligent conversation. Upload,
              ask, and get instant answers powered by advanced AI technology.
            </p>
            <a className="hero-buttons" href="/login">
              <button className="btn-primary">Chat Now</button>
              {/* <button className="btn-secondary">Watch Demo</button> */}
            </a>
          </div>
          <div className="hero-visual">
            <div className="chat-preview">
              <div className="chat-header">
                <div className="document-icon">📄</div>
                <div>
                  <h3>Research Paper.pdf</h3>
                  <p
                    style={{
                      color: "var(--secondary-dark)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Ready to chat
                  </p>
                </div>
              </div>
              <div className="chat-messages">
                <div className="message user-message">
                  What are the key findings in this research?
                </div>
                <div className="message ai-message">
                  Based on the research paper, the three key findings are: 1)
                  Machine learning accuracy improved by 23%...
                </div>
                <div className="message typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="features" id="features">
        <div className="features-container">
          <div className="section-header fade-in">
            <h2>Powerful Features</h2>
            <p>
              Everything you need to unlock the knowledge hidden in your
              documents
            </p>
          </div>
          <div className="features-grid">
            {[
              {
                icon: "⚡",
                title: "Instant Answers",
                desc: "Get immediate responses to your questions about any document. No more scrolling through pages to find information.",
              },
              {
                icon: "🎯",
                title: "Smart Context",
                desc: "Our AI understands context and provides accurate, relevant answers based on the entire document content.",
              },
              {
                icon: "📚",
                title: "Multi-Format Support",
                desc: "Works with PDFs, Word documents, presentations, and more. Upload any document format and start chatting.",
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                desc: "Your documents are encrypted and secure. We prioritize your privacy and data protection above all else.",
              },
              {
                icon: "🚀",
                title: "Lightning Fast",
                desc: "Advanced AI processing ensures you get answers in seconds, not minutes. Boost your productivity instantly.",
              },
              {
                icon: "💡",
                title: "Smart Insights",
                desc: "Get summaries, extract key points, and discover insights you might have missed in your documents.",
              },
            ].map((f, i) => (
              <div key={i} className="feature-card fade-in">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container fade-in">
          <h2>Ready to Transform Your Documents?</h2>
          <p>
            Join thousands of users who are already chatting with their
            documents and boosting their productivity.
          </p>
          <button className="btn-primary" style={{ fontSize: "1.2rem", padding: "1.2rem 2.5rem" }}>
            Start Your Free Trial
          </button>
        </div>
      </section> */}
    </>
  );
}
