using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers
{
    public class SanPhamsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: SanPhams
        [ActionName("Trang-Chu")]
        public ActionResult Index()
        {
            var sanPhams = db.SanPhams.Include(s => s.LoaiSP).Include(s => s.NhaCungCap);
            return View(sanPhams.ToList());
        }

        // GET: SanPhams/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SanPham sanPham = db.SanPhams.Find(id);
            if (sanPham == null)
            {
                return HttpNotFound();
            }
            return View(sanPham);
        }

        // GET: SanPhams/Create
        [ActionName("Trang-Chu")]
        public ActionResult Create()
        {
            ViewBag.LoaiSPId = new SelectList(db.LoaiSPs, "LoaiSPId", "TenLoai");
            ViewBag.NhaCungCapId = new SelectList(db.NhaCungCaps, "NhaCungCapId", "TenNhaCungCap");
            return View();
        }

        // POST: SanPhams/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "SanPhamId,TenSP,SoLuong,MoTa,DonGia,NhaCungCapId,LoaiSPId")] SanPham sanPham)
        {
            if (ModelState.IsValid)
            {
                db.SanPhams.Add(sanPham);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.LoaiSPId = new SelectList(db.LoaiSPs, "LoaiSPId", "TenLoai", sanPham.LoaiSPId);
            ViewBag.NhaCungCapId = new SelectList(db.NhaCungCaps, "NhaCungCapId", "TenNhaCungCap", sanPham.NhaCungCapId);
            return View(sanPham);
        }

        // GET: SanPhams/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SanPham sanPham = db.SanPhams.Find(id);
            if (sanPham == null)
            {
                return HttpNotFound();
            }
            ViewBag.LoaiSPId = new SelectList(db.LoaiSPs, "LoaiSPId", "TenLoai", sanPham.LoaiSPId);
            ViewBag.NhaCungCapId = new SelectList(db.NhaCungCaps, "NhaCungCapId", "TenNhaCungCap", sanPham.NhaCungCapId);
            return View(sanPham);
        }

        // POST: SanPhams/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "SanPhamId,TenSP,SoLuong,MoTa,DonGia,NhaCungCapId,LoaiSPId")] SanPham sanPham)
        {
            if (ModelState.IsValid)
            {
                db.Entry(sanPham).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.LoaiSPId = new SelectList(db.LoaiSPs, "LoaiSPId", "TenLoai", sanPham.LoaiSPId);
            ViewBag.NhaCungCapId = new SelectList(db.NhaCungCaps, "NhaCungCapId", "TenNhaCungCap", sanPham.NhaCungCapId);
            return View(sanPham);
        }

        // GET: SanPhams/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SanPham sanPham = db.SanPhams.Find(id);
            if (sanPham == null)
            {
                return HttpNotFound();
            }
            return View(sanPham);
        }

        // POST: SanPhams/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            SanPham sanPham = db.SanPhams.Find(id);
            db.SanPhams.Remove(sanPham);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
