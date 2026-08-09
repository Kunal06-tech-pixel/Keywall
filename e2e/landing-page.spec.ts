import { expect, test } from '@playwright/test'

test.describe('Keywall landing page', () => {
  test('keeps the product narrative and in-page navigation connected', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your vault should be unreadable to everyone')
    await expect(page.getByRole('link', { name: 'Create account' }).first()).toHaveAttribute('href', '/app?mode=register')
    await expect(page.getByRole('link', { name: 'Launch app' }).first()).toHaveAttribute('href', '/app')

    const inPageTargets = await page.locator('.kw-nav-links a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')).filter((href): href is string => Boolean(href?.startsWith('#'))),
    )
    for (const target of inPageTargets) {
      await expect(page.locator(target)).toHaveCount(1)
    }

    const flowTabs = page.getByRole('tab')
    await flowTabs.first().focus()
    await page.keyboard.press('ArrowDown')
    await expect(flowTabs.nth(1)).toBeFocused()
    await expect(flowTabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toContainText('Plaintext becomes authenticated ciphertext')

    const firstGate = page.locator('.gate-item-row').first()
    await expect(firstGate).toHaveAttribute('aria-expanded', 'false')
    await firstGate.click()
    await expect(firstGate).toHaveAttribute('aria-expanded', 'true')
  })

  test('supports mobile navigation, focus restoration, and narrow layouts', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const menuButton = page.getByRole('button', { name: 'Open navigation menu' })
    await menuButton.click()
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Security' })).toBeFocused()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflows).toBe(false)
  })

  test('provides a reduced-motion alternative', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const animationDuration = await page.locator('.kw-rail-line i').evaluate((element) => getComputedStyle(element).animationDuration)
    expect(Number.parseFloat(animationDuration)).toBeLessThanOrEqual(0.00001)
  })
})
