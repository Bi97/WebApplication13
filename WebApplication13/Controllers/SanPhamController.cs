using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;
using WebApplication13.Models.ViewModel;

namespace WebApplication13.Controllers
{
    public class SanPhamController : Controller
    {
        private readonly ApplicationDbContext _dbcontext;
        // GET: SanPham

        public SanPhamController()
        {
            _dbcontext = new ApplicationDbContext();
        }

        
        public ActionResult Create()
        {
            var viewModel = new SanPhamViewModel
            {
                LoaiSPs = _dbcontext.LoaiSPs.ToList(),
                NhaCungCaps = _dbcontext.NhaCungCaps.ToList()
            };

            return View(viewModel);
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Create(SanPhamViewModel viewModel)
        {
            var sanpham = new SanPham
            {
                TenSP = viewModel.TenSP,
                SoLuong = viewModel.SoLuong,
                MoTa = viewModel.MoTa,
                LoaiSPId = viewModel.LoaiSP,
                NhaCungCapId = viewModel.NhaCungCap

            };
            _dbcontext.SanPhams.Add(sanpham);
            _dbcontext.SaveChanges();
            return RedirectToAction("Index", "Home");
        }
    }
}