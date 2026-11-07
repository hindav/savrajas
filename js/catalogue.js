/* ==========================================================================
   SAVRAJAS COLLEGE MAJOR PROJECT CATALOGUE ENGINE (js/catalogue.js)
   Search, Filter, Quick-View Modal, Bookmarking & Clipboard Engine
   ========================================================================== */

import { CATEGORIES, PROJECTS } from './catalogue-data.js';

// --- State Management ---
let currentSearchTerm = '';
let activeCategoryId = 'all';
let currentViewMode = 'grid'; // 'grid' or 'list'
let bookmarkedIds = new Set();
let activeModalProjectId = null;

// --- DOM References ---
const searchInput = document.getElementById('catalogueSearchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const categoryPillsContainer = document.getElementById('categoryPillsContainer');

const viewToggleBtn = document.getElementById('viewToggleBtn');
const viewToggleText = document.getElementById('viewToggleText');
const projectsGrid = document.getElementById('projectsGrid');
const resultsCountEl = document.getElementById('resultsCount');
const filterResetBtn = document.getElementById('filterResetBtn');
const projectDetailModal = document.getElementById('projectDetailModal');
const floatingTopBtn = document.getElementById('floatingTopBtn');
const adminToast = document.getElementById('catToast');
const adminToastText = document.getElementById('catToastText');

// --- Category Color Mapping ---
const CATEGORY_COLORS = {
  'ai-genai': '#00d2ff',
  'ai-vision': '#8b5cf6',
  'datascience': '#10b981',
  'cybersecurity': '#f43f5e',
  'web-fullstack': '#0077ff',
  'cloud-tools': '#38bdf8',
  'civic-ai': '#ec4899'
};

// --- Initialize App on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  loadBookmarks();
  renderCategoryPills();
  attachEventListeners();
  renderProjects();
});

// --- Bookmarks Persistence ---
function loadBookmarks() {
  try {
    const saved = localStorage.getItem('savrajas_project_bookmarks');
    if (saved) {
      bookmarkedIds = new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Error loading bookmarks:', e);
  }
}

function saveBookmarks() {
  try {
    localStorage.setItem('savrajas_project_bookmarks', JSON.stringify([...bookmarkedIds]));
  } catch (e) {
    console.error('Error saving bookmarks:', e);
  }
}

function toggleBookmark(projectId, e) {
  if (e) e.stopPropagation();
  if (bookmarkedIds.has(projectId)) {
    bookmarkedIds.delete(projectId);
    showToast('Removed from saved bookmarks');
  } else {
    bookmarkedIds.add(projectId);
    showToast('Project saved to your bookmarks!');
  }
  saveBookmarks();
  renderProjects();
}

// --- Render Category Navigation Pills ---
function renderCategoryPills() {
  if (!categoryPillsContainer) return;

  categoryPillsContainer.innerHTML = CATEGORIES.map(cat => {
    const isActive = cat.id === activeCategoryId ? 'active' : '';
    return `
      <button 
        type="button" 
        class="cat-pill ${isActive}" 
        data-category="${cat.id}"
        id="cat-pill-${cat.id}"
      >
        <span class="cat-pill-icon">${cat.icon}</span>
        <span class="cat-pill-label">${cat.label}</span>
        <span class="cat-pill-count">${cat.count}</span>
      </button>
    `;
  }).join('');

  // Pill click handlers
  categoryPillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-category');
      setActiveCategory(catId);
    });
  });
}

function setActiveCategory(catId) {
  activeCategoryId = catId;
  categoryPillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === catId);
  });
  renderProjects();
}


// --- Filter and Sort Logic ---
function getFilteredProjects() {
  return PROJECTS.filter(project => {
    // 1. Category filter
    if (activeCategoryId !== 'all' && project.categoryId !== activeCategoryId) {
      return false;
    }

    // 2. Search text matching
    if (currentSearchTerm.trim() !== '') {
      const term = currentSearchTerm.toLowerCase().trim();
      const matchTitle = project.title.toLowerCase().includes(term);
      const matchDesc = project.description.toLowerCase().includes(term);
      const matchCat = project.categoryName.toLowerCase().includes(term);
      const matchFocus = (project.focus || '').toLowerCase().includes(term);
      const matchTools = project.tools.some(t => t.toLowerCase().includes(term));

      if (!matchTitle && !matchDesc && !matchCat && !matchFocus && !matchTools) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Default: natural numeric order by project ID
    return a.id - b.id;
  });
}

// --- Render Project Cards ---
function renderProjects() {
  if (!projectsGrid) return;

  const filtered = getFilteredProjects();

  // Update live count
  if (resultsCountEl) {
    resultsCountEl.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${PROJECTS.length}</strong> projects`;
  }

  // Update clear button
  if (filterResetBtn) {
    const hasFilter = currentSearchTerm !== '' || activeCategoryId !== 'all';
    filterResetBtn.classList.toggle('visible', hasFilter);
  }

  // Handle Empty State
  if (filtered.length === 0) {
    const searchTopic = currentSearchTerm.trim() || 'my desired topic';
    const whatsappMsg = encodeURIComponent(`Hi Savrajas! 👋\n\nI want a customized college major project on the topic: "${searchTopic}".\n\nPlease share details about availability, pricing, and delivery timeline.\n\nThank you!`);
    const whatsappLink = `https://wa.me/919699173189?text=${whatsappMsg}`;
    
    projectsGrid.innerHTML = `
      <div class="cat-empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No Matching Projects Found</h3>
        <p class="empty-state-sub">No software project matched "${escapeHtml(currentSearchTerm)}". Try searching for different tech stacks like React, Python, or Streamlit.</p>
        <div class="empty-state-actions">
          <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="btn-custom-project-cta whatsapp-cta" aria-label="Get a custom project on this topic via WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Get a Custom Project on This Topic</span>
          </a>
          <button type="button" class="btn-empty-reset" onclick="resetAllFilters()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    `;
    return;
  }

  // Render Cards Grid
  projectsGrid.innerHTML = filtered.map(p => {
    const isBookmarked = bookmarkedIds.has(p.id);
    const catColor = CATEGORY_COLORS[p.categoryId] || '#0077ff';
    const diffClass = p.difficulty.toLowerCase().includes('advanced') ? 'advanced' 
                    : p.difficulty.toLowerCase().includes('beginner') ? 'beginner' 
                    : 'intermediate';

    const toolsChips = p.tools.map(tool => `
      <span class="tool-chip">${escapeHtml(tool)}</span>
    `).join('');

    const formattedNum = String(p.id).padStart(2, '0');

    return `
      <article 
        class="project-card" 
        style="--category-color: ${catColor};"
        id="project-card-${p.id}"
      >
        <!-- Card Top Meta -->
        <div class="card-top-meta">
          <div class="card-num-and-cat">
            <span class="card-index-tag">#${formattedNum}</span>
            <span class="card-category-badge">${escapeHtml(p.categoryName)}</span>
          </div>
          <button 
            type="button" 
            class="card-fav-btn ${isBookmarked ? 'active' : ''}" 
            title="${isBookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}"
            aria-label="Bookmark project"
            onclick="window.handleCardBookmark(${p.id}, event)"
          >
            <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <!-- Main Body -->
        <div class="card-main-content">
          <h3 class="project-card-title" onclick="window.openProjectModal(${p.id})">
            ${escapeHtml(p.title)}
          </h3>
          <p class="project-card-desc">
            ${escapeHtml(p.description)}
          </p>

          <!-- Suggested Tech Stack -->
          <div class="card-tools-block">
            <span class="card-tools-label">Suggested Stack</span>
            <div class="tools-tags-row">
              ${toolsChips}
            </div>
          </div>

          <!-- Practical Implementation Focus -->
          ${p.focus ? `
            <div class="card-focus-box">
              <span class="focus-bullet">💡</span>
              <span>${escapeHtml(p.focus)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Card Bottom Actions -->
        <div class="card-bottom-actions">
          <div class="difficulty-badge ${diffClass}">
            <span class="diff-dot"></span>
            <span>${escapeHtml(p.difficulty)}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.45rem;">
            <button 
              type="button" 
              class="btn-icon-mini" 
              title="Copy Project Details" 
              onclick="window.copyProjectToClipboard(${p.id}, event)"
              aria-label="Copy project brief"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button 
              type="button" 
              class="btn-card-action" 
              onclick="window.openProjectModal(${p.id})"
            >
              <span>View Specs</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// --- Quick View Modal System ---
function openProjectModal(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project || !projectDetailModal) return;

  activeModalProjectId = projectId;
  const isBookmarked = bookmarkedIds.has(projectId);
  const catColor = CATEGORY_COLORS[project.categoryId] || '#0077ff';
  const diffClass = project.difficulty.toLowerCase().includes('advanced') ? 'advanced' 
                  : project.difficulty.toLowerCase().includes('beginner') ? 'beginner' 
                  : 'intermediate';

  document.getElementById('modalIndexBadge').textContent = `#${String(project.id).padStart(2, '0')}`;
  document.getElementById('modalCatBadge').textContent = project.categoryName;
  document.getElementById('modalCatBadge').style.color = catColor;
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDesc').textContent = project.description;
  document.getElementById('modalDifficulty').textContent = project.difficulty;
  document.getElementById('modalFocus').textContent = project.focus || 'Independent software architecture suitable for academic defense and live prototype demonstration.';
  
  // Render tools in modal
  const modalToolsContainer = document.getElementById('modalTools');
  if (modalToolsContainer) {
    modalToolsContainer.innerHTML = project.tools.map(tool => `
      <span class="tool-chip">${escapeHtml(tool)}</span>
    `).join('');
  }

  // Bookmark button state in modal
  const modalFavBtn = document.getElementById('modalFavBtn');
  if (modalFavBtn) {
    modalFavBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>${isBookmarked ? 'Saved' : 'Bookmark'}</span>
    `;
    modalFavBtn.classList.toggle('active', isBookmarked);
  }

  projectDetailModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectDetailModal) return;
  projectDetailModal.classList.remove('open');
  document.body.style.overflow = '';
  activeModalProjectId = null;
}

// --- Copy Details to Clipboard ---
function copyProjectToClipboard(projectId, e) {
  if (e) e.stopPropagation();
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;

  const textToCopy = `🎓 COLLEGE MAJOR PROJECT IDEA: ${project.title}
Track: ${project.categoryName} (#${project.id})
Difficulty: ${project.difficulty}
Suggested Tools: ${project.tools.join(', ')}

Description:
${project.description}

Practical Focus & Scope:
${project.focus || 'End-to-end working software prototype for laptop or phone.'}

Source: Savrajas College Project Catalogue (savrajas.in)`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => showToast(`Copied "${project.title}" details to clipboard!`))
      .catch(() => fallbackCopy(textToCopy));
  } else {
    fallbackCopy(textToCopy);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Copied project details to clipboard!');
  } catch (err) {
    showToast('Unable to copy automatically');
  }
  document.body.removeChild(ta);
}

// --- Toast Notification ---
let toastTimeout = null;
function showToast(message) {
  if (!adminToast || !adminToastText) return;

  adminToastText.textContent = message;
  adminToast.classList.add('visible');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    adminToast.classList.remove('visible');
  }, 2800);
}

// --- Reset Filters ---
function resetAllFilters() {
  currentSearchTerm = '';
  activeCategoryId = 'all';

  if (searchInput) searchInput.value = '';
  if (searchClearBtn) searchClearBtn.classList.remove('visible');

  categoryPillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
  });

  renderProjects();
}

// --- Event Listeners Setup ---
function attachEventListeners() {
  // Search input with instant debounce
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', currentSearchTerm.length > 0);
      }
      renderProjects();
    });
  }

  // Clear search button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchTerm = '';
      searchClearBtn.classList.remove('visible');
      searchInput.focus();
      renderProjects();
    });
  }



  // View Toggle (Grid / List)
  if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', () => {
      currentViewMode = currentViewMode === 'grid' ? 'list' : 'grid';
      projectsGrid.classList.toggle('list-view', currentViewMode === 'list');
      if (viewToggleText) {
        viewToggleText.textContent = currentViewMode === 'grid' ? 'Grid' : 'List';
      }
    });
  }

  // Reset Filters Link
  if (filterResetBtn) {
    filterResetBtn.addEventListener('click', resetAllFilters);
  }

  // Modal Backdrop click to close
  if (projectDetailModal) {
    projectDetailModal.addEventListener('click', (e) => {
      if (e.target === projectDetailModal) {
        closeProjectModal();
      }
    });
  }

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectDetailModal && projectDetailModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // Modal Favorite button
  const modalFavBtn = document.getElementById('modalFavBtn');
  if (modalFavBtn) {
    modalFavBtn.addEventListener('click', () => {
      if (activeModalProjectId) {
        toggleBookmark(activeModalProjectId);
        // Refresh modal state
        openProjectModal(activeModalProjectId);
      }
    });
  }

  // Modal Copy button
  const modalCopyBtn = document.getElementById('modalCopyBtn');
  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', () => {
      if (activeModalProjectId) {
        copyProjectToClipboard(activeModalProjectId);
      }
    });
  }

  // Scroll listener for Navbar & Back to Top button
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const navbar = document.getElementById('catNavbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 20);
    }
    if (floatingTopBtn) {
      floatingTopBtn.classList.toggle('visible', scrollY > 400);
    }
  }, { passive: true });

  // Floating Back to Top Button
  if (floatingTopBtn) {
    floatingTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// --- Utility: Safe HTML Escaping ---
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Global Window Bindings for Inline Card Triggers ---
window.handleCardBookmark = toggleBookmark;
window.copyProjectToClipboard = copyProjectToClipboard;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.resetAllFilters = resetAllFilters;
