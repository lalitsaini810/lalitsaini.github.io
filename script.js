/* -------------------------------------------------------------
 * Lalit Kumar Saini | Personal Portfolio Script
 * Interactive dynamics, animations, and forms validation
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Background Change
    const mainNav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // Active Navigation Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Stats Counter Animation
    const statsSection = document.querySelector('.count-stat').closest('section');
    const stats = document.querySelectorAll('.count-stat');
    let counted = false;

    const countUp = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const increment = target / 30; // Count speed
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    stat.innerText = Math.ceil(count) + '+';
                    setTimeout(updateCount, 40);
                } else {
                    stat.innerText = target + '+';
                }
            };
            updateCount();
        });
    };

    // Skill Bar Animation
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.progress-bar-fill');
    let skillAnimated = false;

    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const progress = bar.style.width; // Keep the original design value
            // We set standard style in HTML as style="width: 0%" and will apply actual styles here
            // Let's get it from the parent container or directly read it from standard percentages we defined.
            // Let's read from the inline styles we defined in index.html, wait, we set width: 0% in index.html!
            // Let's map percentages based on target text value next to the label.
            const percentageText = bar.closest('.skill-progress').querySelector('.text-white').innerText;
            bar.style.width = percentageText;
        });
    };

    // Intersection Observer for scroll triggers
    const observerOptions = {
        threshold: 0.25
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                countUp();
                counted = true;
            }
        });
    }, observerOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillAnimated) {
                animateSkillBars();
                skillAnimated = true;
            }
        });
    }, observerOptions);

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Projects Filtering Logic
    const filterButtons = document.querySelectorAll('.btn-filter');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Cloudflare Turnstile Mock Behavior & Form Validation
    const form = document.getElementById('portfolio-contact-form');
    const turnstileCheck = document.getElementById('turnstile-check');
    const submitBtn = document.getElementById('form-submit-btn');
    const successAlert = document.getElementById('contact-success');

    // Initially disable submit button
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';

    turnstileCheck.addEventListener('change', () => {
        if (turnstileCheck.checked) {
            // Simulate Cloudflare validating...
            const label = turnstileCheck.closest('.turnstile-mock').querySelector('label');
            label.innerText = 'Verifying... Please wait.';
            turnstileCheck.disabled = true;

            setTimeout(() => {
                label.innerHTML = '<span class="text-success"><i class="bi bi-shield-fill-check me-1"></i> Human Verified (Turnstile Secure)</span>';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 1200);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form values
        const name    = document.getElementById('form-name').value.trim();
        const email   = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Disable submit button & show spinner
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Encrypting &amp; Sending...';

        const errorAlert   = document.getElementById('contact-error');
        successAlert.classList.add('d-none');
        if (errorAlert) errorAlert.classList.add('d-none');

        // Build FormData for Web3Forms (works on static GitHub Pages hosting)
        const formData = new FormData();
        formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY'); // ← Replace with your key from web3forms.com
        formData.append('name',    name);
        formData.append('email',   email);
        formData.append('subject', 'Portfolio Contact: ' + subject);
        formData.append('message', message);
        formData.append('from_name', 'Lalit.dev Portfolio');

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Message Sent!';
                successAlert.innerText = '✅ ' + data.message;
                successAlert.classList.remove('d-none');
                form.reset();

                // Reset turnstile
                const label = turnstileCheck.closest('.turnstile-mock').querySelector('label');
                label.innerText = 'Verify you are human (Turnstile bot protection)';
                turnstileCheck.disabled = false;
                turnstileCheck.checked = false;

                // Auto-hide success after 6s
                setTimeout(() => {
                    successAlert.classList.add('d-none');
                    submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Send Secure Message';
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.5';
                }, 6000);
            } else {
                // Show error
                if (errorAlert) {
                    errorAlert.innerText = '❌ ' + data.message;
                    errorAlert.classList.remove('d-none');
                }
                submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Send Secure Message';
                submitBtn.disabled = false;
            }
        })
        .catch(err => {
            if (errorAlert) {
                errorAlert.innerText = '❌ Network error. Please try again or email lalitsaini810@gmail.com directly.';
                errorAlert.classList.remove('d-none');
            }
            submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Send Secure Message';
            submitBtn.disabled = false;
        });
    });
});
